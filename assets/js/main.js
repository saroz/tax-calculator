const monthlyBasicIncomeField = document.getElementById('monthlyBasicIncome');
const monthlyAllowanceIncomeField = document.getElementById('monthlyAllowanceIncome');
const ssfField = document.getElementById('ssf');
const ssfCheck = document.getElementById('ssfCheck');

let basic = 0;
let allowance = 0;
let ssf = 0;

// Allowance Calculation
monthlyBasicIncomeField.addEventListener('blur', function() {
    basic = parseFloat(monthlyBasicIncomeField.value);
    allowance = (basic / 0.6) * 0.4;
    monthlyAllowanceIncomeField.value = `${allowance}`;
})

// SSF Calculation
ssfCheck.addEventListener('change', function(e) {
    if(ssfCheck.checked) {
        ssf = basic * 0.31;
        ssfField.value = ssf;
    } else {
        ssfField.value = 0;
    }
})

function validateAndCalculate() {
    // Personal Info
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const maritalStatus = document.getElementsByName('maritalStatus')[0].value;

    const totalMonth = Number(document.getElementById('totalMonth').value);
    const bonus = parseFloat(document.getElementById('bonus').value);

    // Deduction ( Saving/ Investment )
    const cit = parseFloat(document.getElementById('cit').value) || 0;
    const pf = parseFloat(document.getElementById('pf').value) || 0;

    // Deduction - Insurance
    const lifeInsuranceCheck = Number(document.getElementById('lifeInsuranceCheck').value) || 0;
    const healthInsuranceCheck = Number(document.getElementById('healthInsuranceCheck').value) || 0;
    let printData = document.getElementById('taxDetails');

    // Email & Phone Validation
    if (!validateEmail(email) || !validatePhone(phone)) {
        return false;
    }

    const totalDeductions = (ssf + cit + pf) * totalMonth;
    const salaryMonthly = basic + allowance;
    const salaryAnnually = (salaryMonthly  * totalMonth) + bonus;
    const insurance = lifeInsuranceCheck + healthInsuranceCheck;
    const taxableIncome = salaryAnnually - (totalDeductions + insurance);
    let tax = 0;

    if (maritalStatus === 'Unmarried') {
        tax = calculateTaxUnmarried(taxableIncome);
    } else {
        tax = calculateTaxMarried(taxableIncome);
    }

    const result = {
        fullName,
        email,
        phone,
        maritalStatus,
        taxableIncome,
        "inbank": {
            "monthly": (salaryAnnually - (bonus + tax))/totalMonth,
            "bonus": bonus,
            "salaryAnnually": salaryAnnually - tax,
        },
        "remuneration": {
            "monthly": salaryMonthly + ssf,
            "Annually": salaryAnnually + (ssf * totalMonth),
        },
        "deduction": {
            ssf,
            cit,
            pf,
        },
        "tax": {
            "monthly": tax / totalMonth,
            "Annually": tax,
        }
    };

    console.log(taxableIncome);
    localStorage.setItem('taxData', JSON.stringify(result));
    printData.innerHTML = (`Income Tax Calculated: NPR ${tax}`)
    alert(`Income Tax Calculated: NPR ${tax}`);
    return false;
}

function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^\d{10}$/;
    return re.test(phone);
}

function calculateAllowanceSSF(basicSalary) {

}

function calculateTaxUnmarried(income) {
    let calc = 0;
    if (income <= 500000) {
        calc = income * 0.01;
        console.log(calc);
        return calc;
    } else if (income <= 700000) {
        return 5000 + (income - 500000) * 0.1;
    } else if (income <= 2000000) {
        return 25000 + (income - 700000) * 0.2;
    } else {
        return 275000 + (income - 2000000) * 0.3;
    }
}

function calculateTaxMarried(income) {
    console.log(income)
    if (income <= 600000) {
        return income * 0.01;
    } else if (income <= 800000) {
        return 6000 + (income - 600000) * 0.1;
    } else if (income <= 2000000) {
        return 26000 + (income - 800000) * 0.2;
    } else {
        return 266000 + (income - 2000000) * 0.3;
    }
}
