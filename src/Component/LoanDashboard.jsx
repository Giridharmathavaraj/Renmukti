import React, { useState, useEffect } from 'react';
import './LoanDashboard.css'
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from './Nav';
import { getApiUrl } from '../apiConfig';
import {
  ChevronDown, Bell, Mail, HelpCircle, User,
  Search, Pin, List, Plus // Changed Thumbtack to Pin
} from 'lucide-react';
import LoanForm from './LoanForm';
import ParticularUserPage from './ParticularUserPage';

const LoanDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location)
  console.log(navigate)
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // State for loans
  const [loanData, setLoanData] = useState([]);

  // Fetch Loans from Backend
  const fetchLoans = async () => {
    try {
      console.log("Fetching loans...");
      const response = await fetch(getApiUrl('/api/loans'), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Loans fetched:", data);
        // Transform data to match table structure if needed
        const formattedData = data.map(loan => {
          // Dynamic Calculations
          const principal = Number(loan.Request_Loan_Amount ?? 0);
          const statedRate = Number(loan.interestRate ?? 12) / 100;
          const rateType = loan.interestRateType || 'Annually';
          const fees = Number(loan.underwritingRefinanceFee ?? 0);
          const frequency = loan.paymentFrequency || 'Monthly';
          const annualInterestRate = rateType === 'Monthly' ? statedRate * 12 : statedRate;
          
          const termYears = 5;
          let periodsPerYear = 12;
          if (frequency === 'Weekly') periodsPerYear = 52;
          if (frequency === 'Bi-Weekly') periodsPerYear = 26;
          if (frequency === 'Quarterly') periodsPerYear = 4;
          if (frequency === 'Annually') periodsPerYear = 1;
          
          const totalPeriods = termYears * periodsPerYear;
          const interestExpense = principal * annualInterestRate * termYears;
          const financeCharge = interestExpense + fees;
          const totalOfPayments = principal + financeCharge;
          const basePayment = totalPeriods > 0 ? totalOfPayments / totalPeriods : 0;
          
          const completedCount = Object.keys(loan.completedPayments || {}).length;
          const principalRatio = totalOfPayments > 0 ? (principal / totalOfPayments) : 0;
          const paidPrincipal = completedCount * basePayment * principalRatio;
          const balance = principal - paidPrincipal;
          
          let schedule = loan.transactions || [];
          if (!schedule.length && loan.firstPaymentDate) {
            let currentDate = new Date(loan.firstPaymentDate + 'T12:00:00');
            if (isNaN(currentDate.getTime())) currentDate = new Date(loan.firstPaymentDate);
            for (let i = 1; i <= totalPeriods; i++) {
              const compDate = loan.completedPayments?.[i] || null;
              schedule.push({
                period: i,
                date: new Date(currentDate).toLocaleDateString(),
                Status: compDate ? 'Completed' : 'Pending',
                completedDate: compDate,
                payment: basePayment
              });
              if (frequency === 'Weekly') currentDate.setDate(currentDate.getDate() + 7);
              else if (frequency === 'Bi-Weekly') currentDate.setDate(currentDate.getDate() + 14);
              else if (frequency === 'Monthly') currentDate.setMonth(currentDate.getMonth() + 1);
              else if (frequency === 'Quarterly') currentDate.setMonth(currentDate.getMonth() + 3);
              else if (frequency === 'Annually') currentDate.setFullYear(currentDate.getFullYear() + 1);
            }
          }
          
          const today = new Date();
          let amountPastDue = 0;
          let dpd = 0;
          let nextPayment = 'N/A';
          
          if (schedule.length > 0) {
            const nextPending = schedule.find(t => t.Status === 'Pending');
            if (nextPending) nextPayment = nextPending.date || 'N/A';
            
            schedule.forEach(t => {
              if (t.Status === 'Pending' && t.date) {
                const txDate = new Date(t.date);
                const diffDays = Math.floor((today - txDate) / (1000 * 60 * 60 * 24));
                if (diffDays > 0) {
                  amountPastDue += (t.payment || basePayment);
                  if (diffDays > dpd) dpd = diffDays;
                }
              }
            });
          }

          let status = 'Open';
          let subStatus = 'Open - Repaying';
          if (schedule.length > 0 && !schedule.find(t => t.Status === 'Pending')) {
            status = 'Closed';
            subStatus = 'Closed - Paid Off';
          } else if (dpd > 0) {
            subStatus = 'Open - Delinquent';
          }
          
          return {
            _id: loan._id,
            id: loan._id.substring(loan._id.length - 6), // Last 6 chars of ID
            name: `${loan.firstName} ${loan.lastName}`,
            status,
            subStatus,
            dpd,
            amountPastDue,
            balance: Math.max(0, balance),
            nextPayment
          };
        });
        setLoanData(formattedData);
      } else {
        console.error("Fetch response not ok:", response.status);
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          localStorage.removeItem('role');
          localStorage.removeItem('companyId');
          navigate('/login');
        } else {
          alert(`Failed to fetch loans: Server responded with status ${response.status}`);
        }
      }
    } catch (error) {
      console.error("Error fetching loans:", error);
      alert(`Error fetching loans: ${error.message}. Is the backend server running?`);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredLoans = loanData.filter(loan =>
    loan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.id.toLowerCase().includes(searchTerm.toLowerCase())
  );





  const handleControl = async (loan) => {
    try {
      // Use the full _id which we added to the mapped data
      const loanId = loan._id;
      console.log("Fetching full details for:", loanId);

      const response = await fetch(getApiUrl(`/api/loans/${loanId}`), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Full details:", data);
        console.log(`Loan Details:\nName: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\nBalance: $${data.Request_Loan_Amount}`);

        // navigator('./ParticularUserPage')
        navigate('/ParticularUserPage', { state: { loanData: data } });
      } else {
        console.error("Failed to fetch details:", response.status);
        console.log("Failed to fetch loan details. Server returned " + response.status);
      }
    } catch (error) {
      console.error("Error in handleControl:", error);
      console.log("Error fetching details: " + error.message);
    }
  }

  return (
    <div className="dashboard-wrapper">
      {/* HEADER */}
      <Nav />

      <main className="container">
        {/* PAGE TITLE & BUTTON */}
        <div className="page-header">
          <h1>Account Manager</h1>
          <div className="dropdown">
            <button
              className="btn-dark"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              New Loan <ChevronDown size={14} />
            </button>
            {isDropdownOpen && (
              <div className="dropdown-content show">
                {/* <a href="#">Custom Onboarding</a>
                <a href="#">Pre-Configured</a>
                <a href="#">Standard</a>
                <a href="#" onClick={(e)=>{
                  setIsDropdownOpen(false)
                }}>
                  Quick Quote</a>
                <hr /> */}
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  setIsModalOpen(true);
                  setIsDropdownOpen(false); // Close dropdown after selection
                }}>Loan Application</a>
              </div>
            )}
          </div>

        </div>

        {/* TABS */}
        <div className="tabs">
          <button className="tab active"><Pin size={14} /><a onClick={(e) => {
            e.preventDefault();
            setIsModalOpen(true);
            setIsDropdownOpen(false); // Close dropdown after selection
          }}>Loan Application</a></button>
          <button className="tab active"><Pin size={14} /> All Loans</button>
          {/* <button className="tab"><Pin size={14} /> All Past Due</button>
  <button className="tab"><Pin size={14} /> Due Soon</button>
          <button className="tab"><List size={14} /> All Searches</button>
          <button className="tab btn-new"><Plus size={14} /> New Search</button> */}
        </div>

        {/* SEARCH */}
        <div className="search-container">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Filter by Keyword"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="table-card">
          <div className="table-header">{filteredLoans.length} RESULTS</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>ACCOUNT <ChevronDown size={10} /></th>
                  <th>WARNING FLAGS</th>
                  <th>DAYS PAST DUE <ChevronDown size={10} /></th>
                  <th>LOAN STATUS <ChevronDown size={10} /></th>
                  <th>LOAN SUB STATUS <ChevronDown size={10} /></th>
                  <th>AMOUNT PAST DUE <ChevronDown size={10} /></th>
                  <th>PRINCIPAL BALANCE <ChevronDown size={10} /></th>
                  <th>NEXT PAYMENT DATE <ChevronDown size={10} /></th>
                </tr>
              </thead>
              <tbody >
                {filteredLoans.map((loan, index) => (

                  <tr key={index} onClick={() => handleControl(loan)}>
                    <td><input type="checkbox" /></td>
                    <td className="account-cell">
                      <div className="avatar-table">
                        <User size={18} />
                        <span className="online-dot"></span>
                      </div>
                      <div>
                        <div className="name">{loan.name}</div>
                        <div className="id">{loan.id}</div>
                      </div>
                    </td>
                    <td className="center">—</td>
                    <td>{loan.dpd}</td>
                    <td>
                      <span className={`badge ${loan.status === 'Open' ? 'blue' : 'gray'}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td><span className="sub-status">{loan.subStatus}</span></td>
                    <td>${loan.amountPastDue.toFixed(2)}</td>
                    <td>${loan.balance.toFixed(2)}</td>
                    <td>{loan.nextPayment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <LoanForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoanAdded={fetchLoans}
      />
    </div>
  );
};

export default LoanDashboard;