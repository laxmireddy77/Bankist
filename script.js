'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP


// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});




const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// for (const movement of movements) {
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
}
console.log('---- FOREACH ----');
movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`Movement ${i + 1}: You deposited ${mov}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
  }
});




const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});
// Set
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}: ${value}`);
});


const eurToUsd = 1.1;
// const movementsUSD = movements.map(function (mov) {
//   return mov * eurToUsd;
// });
const movementsUSD = movements.map(mov => mov * eurToUsd);
console.log(movements);
console.log(movementsUSD);
const movementsUSDfor = [];
for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);
console.log(movementsUSDfor);
const movementsDescriptions = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);
console.log(movementsDescriptions);

const deposits1 = movements.filter(function (mov, i, arr) {
  return mov > 0;
});
console.log(movements);
console.log(deposits1);
const depositsFor = [];
for (const mov of movements) if (mov > 0) depositsFor.push(mov);
console.log(depositsFor);
const withdrawals1 = movements.filter(mov => mov < 0);
console.log(withdrawals1);
///////////////////////////////////////
// The reduce Method
console.log(movements);
// accumulator -> SNOWBALL
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 0);
const balance = movements.reduce((acc, cur) => acc + cur, 0);
console.log(balance);
let balance2 = 0;
for (const mov of movements) balance2 += mov;
console.log(balance2);
// Maximum value
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(max);


// PIPELINE
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map((mov, i, arr) => {
    // console.log(arr);
    return mov * eurToUsd;
  })
  // .map(mov => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositsUSD);


const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);
console.log(accounts);
const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);
///////////////////////////////////////
// some and every
console.log(movements);
// EQUALITY
console.log(movements.includes(-130));
// SOME: CONDITION
console.log(movements.some(mov => mov === -130));
const anyDeposits = movements.some(mov => mov > 0);
console.log(anyDeposits);
// EVERY
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));
// Separate callback
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));


const overalBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance);
// flatMap
const overalBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance2);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);
  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
});


const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);

console.log(bankDepositSum);

// 2.
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;

const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);

console.log(numDeposits1000);




const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(deposits, withdrawals);









// Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

// // Elements
// const labelWelcome = document.querySelector('.welcome');
// const labelDate = document.querySelector('.date');
// const labelBalance = document.querySelector('.balance__value');
// const labelSumIn = document.querySelector('.summary__value--in');
// const labelSumOut = document.querySelector('.summary__value--out');
// const labelSumInterest = document.querySelector('.summary__value--interest');
// const labelTimer = document.querySelector('.timer');

// const containerApp = document.querySelector('.app');
// const containerMovements = document.querySelector('.movements');

// const btnLogin = document.querySelector('.login__btn');
// const btnTransfer = document.querySelector('.form__btn--transfer');
// const btnLoan = document.querySelector('.form__btn--loan');
// const btnClose = document.querySelector('.form__btn--close');
// const btnSort = document.querySelector('.btn--sort');

// const inputLoginUsername = document.querySelector('.login__input--user');
// const inputLoginPin = document.querySelector('.login__input--pin');
// const inputTransferTo = document.querySelector('.form__input--to');
// const inputTransferAmount = document.querySelector('.form__input--amount');
// const inputLoanAmount = document.querySelector('.form__input--loan-amount');
// const inputCloseUsername = document.querySelector('.form__input--user');
// const inputClosePin = document.querySelector('.form__input--pin');

// ///////////////////////////////////////////////
// ///////////////////////////////////////////////
// // LECTURES

// /////////////////////////////////////////////////
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// for(const movement of movements){
//   if(movement>0){
//     console.log(`you deposited ${movement}`);
//   }else{
//     console.log(`you withdraw ${Math.abs(movement)}`);
//   }
// }
// console.log("-----forEach------");
// movements.forEach(function(movement){
//   if(movement>0){
//     console.log(`you deposited ${movement}`);
//   }else{
//     console.log(`you withdraw ${Math.abs( movement)}`);
//   }
// })
// for(const [i,movement] of movements.entries()){
//     if(movement>0){
//       console.log(`Movement${i+1}:deposited ${movement}`);
//     }else{
//       console.log(`Movement${i+1}:withdraw ${Math.abs(movement)}`);
//     }
//   }
// movements.forEach(function(mov,i,arr){
//   if(mov>0){
//     console.log(`Movement${i+1}:deposited ${mov}`);
//   }else{
//     console.log(`Movement${i+1}:withdraw ${Math.abs(mov)}`);
//   }
// })
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);
// currencies.forEach(function(value,key,arr){
//   console.log(`${key}:${value}`);
// })

// const displayMovements=function(movements,sort=false){
//   containerMovements.innerHTML="";

//   const movs=sort?movements.slice().sort((a,b)=>a-b):movements;

//   movs.forEach(function (mov,i) {

//     const type=mov>0?"deposit":"withdrawal";
//     const html=`
//      <div class="movements__row">
//   <div class="movements__type
//    movements__type--${type}">${i+1}${type}</div>
//   <div class="movements__value">${mov}</div>`;
//   containerMovements.insertAdjacentHTML("afterbegin",html);
//   });
// };

// const calDisplayBalance=function(acc){
//   acc.balance=acc.movements.reduce((acc,mov)=>acc+mov,0);
// labelBalance.textContent=acc.balance;
// }


// const calDisplaySummary=function(acc){
//   const incomes=acc.movements.filter(mov=>mov>0).reduce((acc,mov)=>acc+mov,0)
//   labelSumIn.textContent=incomes;
//   const outcomes=acc.movements.filter(mov=>mov<0).reduce((acc,mov)=>acc+mov,0)
//   labelSumOut.textContent=Math.abs(outcomes);
//   const interest=acc.movements.filter(mov=>mov>0).map(deposit=>(deposit*acc.interestRate)/100).filter((int,i,arr)=>
//   {console.log(arr);
//     return int>=1
//   }) .reduce((acc,int)=>acc+int,0);
//   labelSumInterest.textContent=interest;
// }


// const createUsernames=function(accs){
//   accs.forEach(function(acc){
//     acc. username=acc.owner.toLowerCase().split(' ').map(name=>name[0]).join("");
   
//   })

// }
// createUsernames(accounts);


// const updateUI=function(acc){
//   displayMovements(acc.movements);
//   calDisplayBalance(acc);
//   calDisplaySummary(acc);
// }


// let currentAccount;
// btnLogin.addEventListener("click",function(e){
// e.preventDefault();
// currentAccount=accounts.find(acc=>acc.username===inputLoginUsername.value);
// console.log(currentAccount);
// if(currentAccount?.pin===Number(inputLoginPin.value));
// labelWelcome.textContent=`Welcome back,${currentAccount.owner.split(" ")[0]}`;
// containerApp.style.opacity=100;


// inputLoginUsername.value=inputLoginPin.value='';
// inputLoginPin.blur();


// updateUI(currentAccount)
// })

// btnTransfer.addEventListener("click",function(e){
//   e.preventDefault();
//   const amount=Number(inputTransferAmount.value);
//   const recAcc=accounts.find(acc =>acc.username===inputTransferTo.value);
//   inputTransferAmount.value=inputTransferTo.value='';
//   if(amount>0&&recAcc&&currentAccount.balance>=amount&&recAcc.username!==currentAccount.username){
//     currentAccount.movements.push(-amount);
//     recAcc.movements.push(amount);
//     updateUI(currentAccount)
//   }
// });

// btnLoan.addEventListener("click",function(e){
// e.preventDefault();
// const amount=Number(inputLoanAmount.value);
// if(amount>0&&currentAccount.movements.some(mov=>mov>=amount*0.1)){
//   currentAccount.movements.push(amount);
//   updateUI(currentAccount);
// }
// inputLoanAmount.value='';
// })



// btnClose.addEventListener("click",function(e){
//   e.preventDefault();
  
//   if(
//     inputCloseUsername.value===currentAccount. 
//     username&&
//      Number(inputClosePin.value)===currentAccount.pin){
//     const index=accounts.findIndex(
//       acc=>acc.username===currentAccount.username
//       );
//     console.log(index);
//     accounts.splice(index,1);
// containerApp.style.opacity=0;
//   }
//   inputCloseUsername.value=inputClosePin.value='';
// });
// let sorted=false;
// btnSort.addEventListener("click",function(e){
//   e.preventDefault();
//   displayMovements(currentAccount.movements,!sorted);
//   sorted=!sorted;
// })
// console.log(accounts);

// const eurToUsd=1.1;
// const movementsUSD=movements.map(movement=>
//    movement*eurToUsd);

// console.log(movements);
// console.log(movementsUSD);

// const movementsUsdFor=[];
// for(const mov of movements)
//  movementsUsdFor.push(mov*eurToUsd);
//  console.log(movementsUsdFor);
// //
//  const movementsDescription= movements.map((mov,i)=>
//  `Movement${i+1}:you ${mov>0?"deposited":"withdrawal"} ${Math.abs(mov)}`)
  

// console.log(movementsDescription);
// const deposits=movements.filter(function(mov){
// return mov>0;
// })
// console.log(movements);
// console.log(deposits);

// const withDrawls=movements.filter(function(mov){
//   return mov<0
// })
// console.log(movements);
// console.log(withDrawls);
// const deposit=[];
// const withdraws=[];
// for( const mov of movements)
//   if(mov>0)deposit.push(mov);
//   console.log(deposit);

//   for(const move of movements )if(move<0)withdraws.push(move);
//   console.log(withdraws);

// const balance=movements.reduce(function(acc,curr,i,arr){
//   console.log(`Iteration ${i}:${acc}`);
// return acc+curr;
// },0)
// console.log(balance);
// const balance=movements.reduce((acc,curr,)=> acc+curr,0);
// console.log(balance);
// let balance2=0;
// for(const mov of movements)
//   balance2+=mov;
//   console.log(balance2);
// const max=movements.reduce((acc,mov)=>{if(acc>mov)
//   return acc;
//   else return mov;
// },movements[0]);
// console.log(max);



//  const eurToUsd=1.1;
//  const totalDeposits=movements.filter(mov=>mov>0).map(mov=>mov*eurToUsd).reduce((acc,mov)=>acc+mov,0);
//  console.log(totalDeposits);

//  movements.sort((a,b)=>{
//   if(a>b){
//     return 1;
//   }else if(a<b){
//     return -1;
//   }
//  })
//  console.log(movements);
//  movements.sort((a,b)=>{
//   if(a>b){
//     return -1;
//   }else if(a<b){
//     return 1;
//   }
//  })
//  console.log(movements);
//  const a= Array.from({length:100},(_,i)=>Math.random(i)*100);
//  console.log(a);

// const movementsUI=Array.from(document.querySelector(".movements__value"),
//   el=>Number(el.textContent.replace('')));

//   labelBalance.addEventListener("click",function(){
//     const movementsUI=Array.from(document.querySelector(".movements__value"),
//   el=>Number(el.textContent.replace('')));
//   console.log(movementsUI);
//   });

//   const depositSum=accounts.flatMap(acc=>acc.movements).filter(mov=>mov>0).reduce((sum,curr)=>sum+curr,0)
//   console.log(depositSum);
  
//   const numDeposits1000=accounts.flatMap(acc=>acc.movements).reduce((count,curr)=>curr>=1000?++count:count,0);
//   console.log(numDeposits1000);

//   const sums=accounts.flatMap(acc=>acc.movements).reduce((sum,curr)=>{
//    sum[curr>0?"deposits":"withDrawals"]+=curr;
//     return sums;
//   },{deposits:0,withDrawals:0});
//   console.log(sums);

//   movements.forEach(function(movement){
//       if(movement>0){
//         console.log(`you deposited ${movement}`);
//       }else{
//         console.log(`you withdraw ${Math.abs( movement)}`);
//       }
//     })

  
