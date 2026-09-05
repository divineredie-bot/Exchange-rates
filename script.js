const firstSelect = document.querySelector('[data-first-select]');
const secondSelect = document.querySelector('[data-second-select]');
const swapBtn = document.querySelector('[data-swap-btn]');
const comparisonInfo = document.querySelector('[data-comparison-info]');

const BASE_URL = 'https://open.er-api.com/v6/latest';
const FIRST_DEFAULT_CURRENCY = 'RUB';
const SECOND_DEFAULT_CURRENCY = 'USD';

let rates = {};

const renderInfo = () => {
    const baseCurrency = firstSelect.value;
    const targetCurrency = secondSelect.value;
    const rate = rates[targetCurrency];

    if (!baseCurrency || !targetCurrency || !rate) {
        comparisonInfo.textContent = 'Choose currencies to see the exchange rate.';
        return;
    }

    comparisonInfo.textContent = `1 ${baseCurrency} = ${rate.toFixed(4)} ${targetCurrency}`;
};

const populateSelects = (selectedBase = FIRST_DEFAULT_CURRENCY, selectedTarget = SECOND_DEFAULT_CURRENCY) => {
    firstSelect.innerHTML = '';
    secondSelect.innerHTML = '';

    const currencies = Object.keys(rates).sort();

    currencies.forEach((currency) => {
        const firstOption = document.createElement('option');
        firstOption.value = currency;
        firstOption.textContent = currency;
        if (currency === selectedBase) firstOption.selected = true;
        firstSelect.appendChild(firstOption);

        const secondOption = document.createElement('option');
        secondOption.value = currency;
        secondOption.textContent = currency;
        if (currency === selectedTarget) secondOption.selected = true;
        secondSelect.appendChild(secondOption);
    });

    if (!firstSelect.value) firstSelect.value = selectedBase;
    if (!secondSelect.value) secondSelect.value = selectedTarget;

    renderInfo();
};

const updateExchangeRate = async () => {
    try {
        const response = await fetch(`${BASE_URL}/${firstSelect.value}`);
        if (!response.ok) {
            throw new Error('Failed to fetch exchange rate');
        }

        const data = await response.json();
        rates = data.rates;
        // rebuild selects but preserve current selections
        populateSelects(firstSelect.value, secondSelect.value);
        renderInfo();
    } catch (error) {
        comparisonInfo.textContent = 'Could not load exchange rates right now.';
        console.error('Error updating exchange rate:', error);
    }
};

const getInitialRates = async () => {
    try {
        const response = await fetch(`${BASE_URL}/${FIRST_DEFAULT_CURRENCY}`);
        if (!response.ok) {
            throw new Error('Failed to fetch initial rates');
        }

        const data = await response.json();
        rates = data.rates;
        populateSelects(FIRST_DEFAULT_CURRENCY, SECOND_DEFAULT_CURRENCY);
        renderInfo();
    } catch (error) {
        comparisonInfo.textContent = 'Could not load exchange rates right now.';
        console.error('Error fetching initial rates:', error);
    }
};

firstSelect.addEventListener('change', updateExchangeRate);
secondSelect.addEventListener('change', renderInfo);

swapBtn.addEventListener('click', () => {
    const prevFirst = firstSelect.value;
    const prevSecond = secondSelect.value;

    // swap the selected values
    firstSelect.value = prevSecond;
    secondSelect.value = prevFirst;

    // fetch rates for the new base and preserve the target
    updateExchangeRate();
});

getInitialRates();
