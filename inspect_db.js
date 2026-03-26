import mongoose from 'mongoose';
import Loan from './src/models/Loan.js';

mongoose.connect('mongodb://127.0.0.1:27017/loanpro_db')
  .then(async () => {
    const loan = await Loan.findOne().sort({ submittedAt: -1 });
    if (loan) {
      console.log('Most recent loan id:', loan._id);
      console.log('Setup details:', {
        Request_Loan_Amount: loan.Request_Loan_Amount,
        interestRate: loan.interestRate,
        paymentFrequency: loan.paymentFrequency
      });
      console.log('Transactions generated?', loan.transactions && loan.transactions.length > 0 ? loan.transactions[0] : 'No transactions');
    } else {
      console.log('No loans found');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Error connecting to db:', err);
    process.exit(1);
  });
