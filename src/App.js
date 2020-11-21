import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import './App.css';
import InfoBox from './InfoBox'
import Map from './Map';
import Table from './Table';
import { sortData, prettyPrintStat } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./globalStyles";
import { lightTheme, darkTheme } from "./Themes";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [caseType, setCaseType] = useState('cases');
  const [theme, setTheme] = useState('light');
  const themeToggler = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light')
  }

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
      });
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2,
            }));
          let sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        })
    }
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' :
      `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then(response => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        if (countryCode === "worldwide") {
          setMapCenter([64.80746, -40.4796]);
          setMapZoom(2);
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(3);
        }
      });
  };
  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <>
        <GlobalStyles />
        <div className="App">
          <div className='app_left'>
            <div className='app_header'>
              <div className='Main'>
                <h1>My <span className='covid-19'>Covid-19</span> Tracker</h1>
                <span className='copyright'>&copy;<a href="https://github.com/nvn5aharan">Nvn</a></span>
                <button className='bulb' onClick={themeToggler}>
                  <svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.66 7.93L12 2.27 6.34 7.93c-3.12 3.12-3.12 8.19 0 11.31C7.9 20.8 9.95 21.58 12 21.58c2.05 0 4.1-.78 5.66-2.34 3.12-3.12 3.12-8.19 0-11.31zM12 19.59c-1.6 0-3.11-.62-4.24-1.76C6.62 16.69 6 15.19 6 13.59s.62-3.11 1.76-4.24L12 5.1v14.49z"></path></svg>
                </button>
              </div>
              <FormControl className='app_dropdown'>
                <Select variant='outlined' onChange={onCountryChange} value={country}>
                  <MenuItem value='worldwide'>Worldwide</MenuItem>
                  {
                    countries.map(country => (
                      <MenuItem value={country.value}>{country.name}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </div>
            <div className='app_stats'>
              <InfoBox isRed active={caseType === 'cases'} onClick={e => setCaseType('cases')} title='Corona cases' cases={prettyPrintStat(countryInfo.todayCases)} Total={prettyPrintStat(countryInfo.cases)} />
              <InfoBox active={caseType === 'recovered'} onClick={e => setCaseType('recovered')} title='Recovered' cases={prettyPrintStat(countryInfo.todayRecovered)} Total={prettyPrintStat(countryInfo.recovered)} />
              <InfoBox isRed active={caseType === 'deaths'} onClick={e => setCaseType('deaths')} title='Deaths' cases={prettyPrintStat(countryInfo.todayDeaths)} Total={prettyPrintStat(countryInfo.deaths)} />
            </div>
            <Map caseType={caseType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
          </div>
          <div className='app_right'>
            <Card style={{ backgroundColor: 'transparent', border: '2px solid gray' }}>
              <CardContent>
                <h3 style={{ color: 'darkgray' }}>Live cases</h3>
                <Table countries={tableData} />
                <h3 style={{ color: 'darkgray' }} className='graphtitle'> Worldwide new {caseType}</h3>
                <LineGraph casesType={caseType} />
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    </ThemeProvider>
  );
};

export default App;
