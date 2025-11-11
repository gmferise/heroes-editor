import React, { useState, useEffect } from 'react';
import BaseView from './BaseView';
import { Grid, Autocomplete, TextField, createFilterOptions } from '@mui/material';
import { getFile, herodata } from '../xml';
import HeroBrowser from '../components/HeroBrowser';

const selectOptions = Object.keys(herodata).sort((valueA, valueB) => valueA.localeCompare(valueB));
const selectFilter = createFilterOptions({
  stringify: (option) => option.replaceAll(/[. '-]+/g, ''),
});

const HomePage = () => {

  const [heroSelect, setHeroSelect] = useState(null);
  const [xml, setXml] = useState(null);

  const handleChange = (event, value) => {
    if (value !== null) {
      setHeroSelect(value);
    }
  };

  useEffect(() => {
    (async () => {
      if (heroSelect !== null) {
        const xml = await getFile(heroSelect);
        setXml(xml);
      }
    })();
  }, [heroSelect]);

  return (
    <BaseView>
      <Grid container marginTop={2} marginX={2} direction='column' rowSpacing={2}>
        <Grid item>
          <Autocomplete
            disablePortal
            options={selectOptions}
            filterOptions={selectFilter}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label='Load XML' />}
            value={heroSelect}
            onChange={handleChange}
            noOptionsText='Hero not found. Make sure to exclude spaces or symbols'
          />
        </Grid>
        <Grid item>
          {xml && (
            <HeroBrowser catalog={xml} />
          )}
        </Grid>
      </Grid>
    </BaseView>
  );
};

export default HomePage;
