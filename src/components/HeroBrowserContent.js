import React, { useEffect, useCallback, useMemo, useContext, useRef, useState } from 'react';
import { Grid, Box, Typography, Button, Popover } from '@mui/material';

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

const PopoverSep = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
}));

const LineButtonStyled = styled(Button)(() => ({
  padding: '0',
  justifyContent: 'flex-start',
  textTransform: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

export function ClickableTag(props) {
  const { element } = props;
  const index = element.attributes.getNamedItem('index');
  const value = element.attributes.getNamedItem('value');

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
        <ValueDisplay value={value.value} />
      )}
    </OverflowBox>
  );
}

function ClickableAttr(props) {
  const { attribute } = props;

  return (
    <OverflowBox>
      <Line component='span' color='attr'>{attribute.localName}</Line>
      <ValueDisplay value={attribute.value} />
    </OverflowBox>
  );
}

function LineButton(props) {
  const {
    color = 'primary',
    children,
    ...buttonProps
  } = props;

  return (
    <LineButtonStyled color={color} fullWidth {...buttonProps}>
      <Line component='span' color={color}>{children}</Line>
    </LineButtonStyled>
  );
}

function ValueDisplay(props) {
  const {
    value,
  } = props;

  const {
    searchCatalog,
    addFrame,
  } = useContext(HeroBrowserContext);

  const [panelIndex, stackIndex] = useContext(HeroFrameContext);

  const [showPopover, setShowPopover] = useState(false);
  const [popoverTarget, setPopoverTarget] = useState(null);

  const catalogEntries = useMemo(() => (
    value ? searchCatalog(value) : []
  ), [value]);

  const handleClick = useCallback((event) => {
    setShowPopover(true);
    setPopoverTarget(event.currentTarget);
  }, [setShowPopover, setPopoverTarget]);

  const handleClosePopover = useCallback(() => {
    setShowPopover(false);
    setPopoverTarget(null);
  }, [setShowPopover, setPopoverTarget]);

  const handleAddFrame = useCallback((element) => {
    addFrame(element, {
      panelIndex: panelIndex + 1,
      fromPanelIndex: panelIndex,
      fromStackIndex: stackIndex,
      scrollIntoView: true,
    });
    handleClosePopover();
  }, [addFrame, panelIndex, stackIndex, handleClosePopover]);

  return catalogEntries.length > 0 ? (
    <>
      <Line component='span' color='grey.300'>: </Line >
      <ClickableLine component='span' color='rel' onClick={handleClick}>{value}</ClickableLine>
      <Popover
        open={showPopover}
        onClose={handleClosePopover}
        anchorEl={popoverTarget}
        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
        transformOrigin={{ vertical: 'center', horizontal: 'left' }}
        slotProps={{ paper: { sx: { marginLeft: 1 } } }}
      >
        <Box paddingY={0.5} paddingX={1}>
          <Grid container direction='column' flexWrap='nowrap' rowSpacing={0.5}>
            <Grid item key={`open-child-id-${value}`}>
              <Line component='span' color='secondary'>#{value}</Line>
            </Grid>
            <Grid item>
              <PopoverSep />
            </Grid>
            {catalogEntries.map((element) => (
              <PopoverEntry
                key={`open-child-${element.tagName}-${element.id}`}
                addFrame={handleAddFrame}
                element={element}
              />
            ))}
          </Grid>
        </Box>
      </Popover>
    </>
  ) : (
    <Line component='span' color='grey.300'>: {value}</Line >
  );
}

function PopoverEntry(props) {
  const {
    addFrame,
    element,
  } = props;

  const handleClick = useCallback(() => {
    addFrame(element);
  }, [addFrame, element]);

  return (
    <Grid item>
      <LineButton onClick={handleClick}>{element.tagName}</LineButton>
    </Grid>
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