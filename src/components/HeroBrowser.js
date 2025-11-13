import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Grid, TextField, Autocomplete } from '@mui/material';
import useSmartContext from '../hooks/useSmartContext';
import HeroBrowserFrame from './HeroBrowserFrame';
import HeroBrowserContext from './HeroBrowserContext';

function HeroBrowser(props) {
  const { catalog } = props;

  /*
  browserData = [panelIndex][stackIndex]{
    startCollapsed: bool,
    parentCloseIntent: bool,
    scrollIntoView: bool
    element: Element,
    ref: React.Ref,
    rels: [{
      toPanelIndex: int,
      toStackIndex: int,
    }],
  }
  */
  const [browserData, setBrowserData] = useState([[]]);
  const [forceCollapseAll, setForceCollapseAll] = useState(false);
  const [tagSelect, setTagSelect] = useState(null);

  const addFrame = useCallback((element, options = {}) => {
    const {
      panelIndex: newPanelIndex = 0,
      stackIndex = null,
      startCollapsed = false,
      scrollIntoView = false,
      parentCloseIntent = false,
      fromPanelIndex,
      fromStackIndex,
    } = options;
    const newFrame = {
      startCollapsed,
      parentCloseIntent,
      scrollIntoView,
      element,
      ref: { current: null },
      rels: [],
    };
    let newStackIndex;
    setBrowserData((prev) => {
      const prevPanel = prev[newPanelIndex] || [];

      // Logic for an existing element
      const existingStackIndex = prevPanel.findIndex((frame) => `${frame.element.tagName}#${frame.element.id}` === `${element.tagName}#${element.id}`);
      if (existingStackIndex !== -1) {
        return prev.map((panel, currentPanelIndex) => panel.map((frame, currentStackIndex) => (
          currentPanelIndex === newPanelIndex && currentStackIndex === existingStackIndex
            ? { ...frame, scrollIntoView: true }
            : frame
        )));
      }

      // Add a new element
      newStackIndex = stackIndex === null ? prevPanel.length : stackIndex;
      const updatedRels = prev.map((panel, currentPanelIndex) => panel.map((frame, currentStackIndex) => ({
        ...frame,
        rels: [
          // Update existing rels if displaced
          ...frame.rels.map((rel) => ({
            ...rel,
            toStackIndex: rel.toPanelIndex === newPanelIndex && rel.toStackIndex >= newStackIndex
              ? rel.toStackIndex + 1
              : rel.toStackIndex,
          })),
          // Add new rel if there is one
          ...(
            currentPanelIndex === fromPanelIndex && currentStackIndex === fromStackIndex
              ? [{ toPanelIndex: newPanelIndex, toStackIndex: newStackIndex }]
              : []
          ),
        ],
      })));
      // Add the new frame
      return updatedRels.slice(0, newPanelIndex).concat([
        (updatedRels[newPanelIndex] || []).concat([newFrame]),
      ]).concat(
        updatedRels.slice(newPanelIndex + 1),
      );
    });
    return [newPanelIndex, newStackIndex];
  }, [setBrowserData]);

  const prepareToCloseFrame = useCallback((panelIndex, stackIndex, enable) => {
    setBrowserData((prev) => {
      const updates = prev.map((panel) => panel.map(() => null));
      const rels = [...prev[panelIndex][stackIndex].rels];
      while (rels.length > 0) {
        const cur = rels[0];
        updates[cur.toPanelIndex][cur.toStackIndex] = enable;
        rels.push(...prev[cur.toPanelIndex][cur.toStackIndex].rels);
        rels.shift();
      }
      return prev.map((panel, i) => panel.map((frame, j) => updates[i][j] === null ? frame : ({ ...frame, parentCloseIntent: updates[i][j] })));
    });
  }, [setBrowserData]);

  const closeFrame = useCallback((panelIndex, stackIndex) => {
    setBrowserData((prev) => {
      const toDelete = prev.map((panel) => panel.map(() => false));
      const rels = [...prev[panelIndex][stackIndex].rels];
      while (rels.length > 0) {
        const cur = rels[0];
        toDelete[cur.toPanelIndex][cur.toStackIndex] = true;
        rels.push(...prev[cur.toPanelIndex][cur.toStackIndex].rels);
        rels.shift();
      }
      return /* IMPLEMENT */;
    });
  }, [setBrowserData]);

  const scrollFrameIntoView = useCallback((panelIndex, stackIndex) => {
    setBrowserData((prev) => {
      const htmlElement = prev[panelIndex][stackIndex].ref.current;
      if (htmlElement) {
        htmlElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
      // await new Promise((resolve) => setTimeout(resolve, 500));
      return prev.map((panel, currentPanelIndex) => panel.map((frame, currentStackIndex) => (
        currentPanelIndex === panelIndex && currentStackIndex === stackIndex
          ? { ...frame, scrollIntoView: false }
          : frame
      )));
    });
  }, [setBrowserData]);

  const searchCatalog = useCallback((elementId) => {
    return Array.from(catalog.querySelectorAll(`*[id="${elementId}"]`));
  }, [catalog]);

  useEffect(() => {
    setBrowserData([]);
    catalog.querySelectorAll('CHero,CUnit,CWeaponLegacy').forEach((entry) => {
      if (!entry.id) return;
      addFrame(entry, { startCollapsed: true });
    });
  }, [catalog]);

  const selectOptions = useMemo(() => (
    Array.from(catalog.querySelector('Catalog').children)
      .map((child) => `${child.tagName}#${child.id}`)
  ), [catalog]);

  const handleSelectTag = useCallback((e, value) => {
    setTagSelect(value);
    if (value === null) return;
    const [tagName, id] = value.split('#');
    const element = catalog.querySelector(`${tagName}[id="${id}"]`);
    addFrame(element);
    setTagSelect(null);
  }, [setTagSelect]);

  const browser = useSmartContext({
    searchCatalog,
    addFrame,
    prepareToCloseFrame,
    scrollFrameIntoView,
    forceCollapseAll,
  });

  return (
    <Grid container direction='column' flexWrap='nowrap' rowSpacing={2}>
      <Grid>
        <Autocomplete
          disablePortal
          options={selectOptions}
          sx={{ width: 600 }}
          renderInput={(params) => <TextField {...params} label='Load Tag' />}
          value={tagSelect}
          onChange={handleSelectTag}
          noOptionsText='Entry not found'
        />
      </Grid>
      <Grid>
        <Grid container flexWrap='nowrap' columnSpacing={2}>
          <HeroBrowserContext.Provider value={browser}>
            {browserData.map((panel, panelIndex) => (
              <Grid key={`hero-browser-panel-${panelIndex}`}>
                <Grid container direction='column' flexWrap='nowrap' rowSpacing={1}>
                  {panel.map((frame, stackIndex) => (
                    <Grid key={`hero-browser-frame-${frame.element.tagName}-${frame.element.id}`}>
                      <HeroBrowserFrame
                        {...frame}
                        panelIndex={panelIndex}
                        stackIndex={stackIndex}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            ))}
          </HeroBrowserContext.Provider>
        </Grid>
      </Grid>
    </Grid>

  );
}

export default HeroBrowser;
