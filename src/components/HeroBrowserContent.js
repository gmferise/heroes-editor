import React, { useEffect, useCallback, useMemo, useContext, useRef, useState } from 'react';
import { Grid, Box, Typography } from '@mui/material';

import { styled } from '@mui/system';
import HeroBrowserContext from './HeroBrowserContext';
import HeroFrameContext from './HeroFrameContext';

const RelativeWrapper = styled(Box)(() => ({
  position: 'relative',
}));

const Indent = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingBottom: theme.spacing(1),
}));

const Line = styled(Typography)(() => ({
  textWrap: 'nowrap',
}));

const ClickableLine = styled(Typography)(() => ({
  textWrap: 'nowrap',
  '&:hover': {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
}));

const OverflowBox = styled(Box)(() => ({
  position: 'relative',
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
}));

function ValueDisplay(props) {
  const {
    value,
    onClick,
  } = props;

  return onClick ? (
    <>
      <Line component='span' color='grey.300'>: </Line >
      <ClickableLine component='span' color='rel' onClick={onClick}>{value}</ClickableLine>
    </>
  ) : (
    <Line component='span' color='grey.300'>: {value}</Line >
  );
}

export function ClickableTag(props) {
  const { element } = props;
  const index = element.attributes.getNamedItem('index');
  const value = element.attributes.getNamedItem('value');

  const {
    searchCatalog,
    addFrame,
  } = useContext(HeroBrowserContext);

  const [panelIndex, stackIndex] = useContext(HeroFrameContext);

  const catalogEntries = useMemo(() => (
    value ? searchCatalog(value.value) : []
  ), [value]);

  const handleAddFrame = useCallback(() => {
    // TODO: Select which one
    catalogEntries.forEach((entry) => {
      addFrame(entry, {
        panelIndex: panelIndex + 1,
        fromPanelIndex: panelIndex,
        fromStackIndex: stackIndex,
      });
    });
  }, [catalogEntries, addFrame, panelIndex, stackIndex]);

  const handleClick = useCallback(
    catalogEntries.length === 0 ? null : handleAddFrame,
    [catalogEntries, handleAddFrame],
  );

  return (
    <OverflowBox>
      <Line component='span' color='primary'>{element.tagName}</Line>
      {element.id && (
        <Line component='span' color='secondary'>#{element.id}</Line>
      )}
      {index && (
        <Line component='span' color='idx'>[{index.value}]</Line>
      )}
      {value && (
        <ValueDisplay value={value.value} onClick={handleClick} />
      )}
    </OverflowBox>
  );
}

const ConnectorBox = styled(Box)(() => ({
  position: 'absolute',
  left: 'calc(100% + 12px)',
  top: '0',
  display: 'flex',
  alignItems: 'center',
}));

function ClickableAttr(props) {
  const { attribute } = props;

  const {
    searchCatalog,
    addFrame,
  } = useContext(HeroBrowserContext);

  const [panelIndex, stackIndex] = useContext(HeroFrameContext);

  const catalogEntries = useMemo(() => (
    searchCatalog(attribute.value)
  ), [attribute.value]);

  const handleAddFrame = useCallback(() => {
    // TODO: Select which one
    catalogEntries.forEach((entry) => {
      addFrame(entry, {
        panelIndex: panelIndex + 1,
        fromPanelIndex: panelIndex,
        fromStackIndex: stackIndex,
      });
    });
  }, [catalogEntries, addFrame, panelIndex, stackIndex]);

  const handleClick = useCallback(
    catalogEntries.length === 0 ? null : handleAddFrame,
    [catalogEntries, handleAddFrame],
  );

  return (
    <OverflowBox>
      <Line component='span' color='attr'>{attribute.localName}</Line>
      <ValueDisplay value={attribute.value} onClick={handleClick} />
    </OverflowBox>
  );
}

export default function HeroBrowserContent(props) {
  const {
    element,
    hideTagName = false,
  } = props;
  const attributes = useMemo(() => (
    Array.from(element.attributes)
      .filter(({ localName }) => !['id', 'index', 'value'].includes(localName))
  ), [element]);
  const children = element.children;

  return (
    <Grid container direction='column' flexWrap='nowrap'>
      <Grid item>
        <Grid container direction='column' flexWrap='nowrap'>
          <Grid item>
            {!hideTagName && (
              <ClickableTag element={element} />
            )}
          </Grid>
          {attributes.length > 0 && (
            <Grid item>
              <Indent>
                {attributes.map((attribute) => (
                  <ClickableAttr key={attribute.localName} attribute={attribute} />
                ))}
              </Indent>
            </Grid>
          )}
        </Grid>
      </Grid>
      {children.length > 0 && (
        <Grid item>
          <Grid container direction='column' flexWrap='nowrap'>
            {Array.from(children).map((child, i) => (
              <Grid item key={i}>
                <Indent>
                  <HeroBrowserContent element={child} />
                </Indent>
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}