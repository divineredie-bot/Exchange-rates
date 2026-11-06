import { useEffect, useMemo, useState } from 'react';
import './index.css';

const BASE_URL = 'https://open.er-api.com/v6/latest';
const DEFAULT_BASE = 'RUB';
const DEFAULT_TARGET = 'USD';

function App() {
  const [rates, setRates] = useState({});
  const [baseCurrency, setBaseCurrency] = useState(DEFAULT_BASE);
  const [targetCurrency, setTargetCurrency] = useState(DEFAULT_TARGET);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BASE_URL}/${baseCurrency}`);
        if (!response.ok) throw new Error('Failed to fetch exchange rate');
        const data = await response.json();
        setRates(data.rates);
      } catch (err) {
        setError('Не удалось загрузить курс. Проверьте соединение.');
        console.error('Error fetching rates:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRates();
  }, [baseCurrency]);

  const currencies = useMemo(() => Object.keys(rates).sort(), [rates]);
  const currentRate = rates[targetCurrency];
  const formattedRate = currentRate ? currentRate.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : '—';

  const handleSwap = () => {
    setBaseCurrency(targetCurrency);
    setTargetCurrency(baseCurrency);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Exchange rates home"><span className="brand-mark">↗</span><span>rates</span></a>
        <span className="status"><i /> Обновляется онлайн</span>
      </header>

      <section className="intro">
        <p className="eyebrow">Конвертер валют</p>
        <h1>Курс, который<br /><em>имеет значение.</em></h1>
        <p className="intro-copy">Сравнивайте валюты по актуальным данным.</p>
      </section>

      <section className="converter" aria-label="Конвертер валют">
        <div className="converter-head"><span>Сейчас</span><span className="source-label">Источник: ExchangeRate API</span></div>
        <div className="currency-row">
          <label className="currency-field"><span>У меня есть</span><select value={baseCurrency} onChange={(e) => setBaseCurrency(e.target.value)}>{currencies.map((currency) => <option key={`base-${currency}`} value={currency}>{currency}</option>)}</select></label>
          <button className="swap-btn" onClick={handleSwap} aria-label="Поменять валюты местами">↕</button>
          <label className="currency-field"><span>Хочу получить</span><select value={targetCurrency} onChange={(e) => setTargetCurrency(e.target.value)}>{currencies.map((currency) => <option key={`target-${currency}`} value={currency}>{currency}</option>)}</select></label>
        </div>

        <div className="rate-result" data-comparison-info>
          <div className="rate-label">1 {baseCurrency} стоит</div>
          <div className="rate-value">{isLoading ? <span className="loading-line" /> : error ? <span className="error-text">Ошибка</span> : formattedRate}{!isLoading && !error && <small>{targetCurrency}</small>}</div>
        </div>
      </section>

      <footer className="page-footer"><span>Курсы могут меняться в течение дня</span><span className="footer-rule" /><span>Данные обновляются автоматически</span></footer>
    </main>
  );
}

export default App;
