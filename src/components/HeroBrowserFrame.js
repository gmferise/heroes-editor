import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { Grid, Box, IconButton, Tooltip, Collapse } from '@mui/material';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import HeroBrowserContent, { ClickableTag } from './HeroBrowserContent';
import HeroBrowserContext from './HeroBrowserContext';
import HeroFrameContext from './HeroFrameContext';

const Frame = styled(Box, {
  shouldForwardProp: (p) => !['frameBorderRed', 'frameBorderPink'].includes(p),
})(({ theme, frameBorderRed, frameBorderPink }) => {
  const borderColor = (
    (frameBorderRed && theme.palette.error.main)
    || (frameBorderPink && theme.palette.rel.main)
    || theme.palette.grey[400]
  );
  return {
    border: `1px solid ${borderColor}`,
    transition: 'border-color ease 0.2s',
    borderRadius: '4px',
    padding: theme.spacing(1, 1.5, 1, 1),
  };
});

function HeroBrowserFrame(props) {
  const {
    panelIndex,
    stackIndex,
    element,
    scrollIntoView,
    startCollapsed,
    parentCloseIntent,
    rels,
    ref,
  } = props;

  const [collapse, setCollapse] = useState(startCollapsed);
  const [collapseTooltip, setCollapseTooltip] = useState(false);
  const [closeIntent, setCloseIntent] = useState(false);

  const {
    forceCollapseAll,
    prepareToCloseFrame,
    scrollFrameIntoView,
  } = useContext(HeroBrowserContext);

  const toggleCollapse = useCallback(() => {
    setCollapse((prev) => !prev);
    // Force close the tooltip
    setCollapseTooltip(false);
  }, [setCollapse, setCollapseTooltip]);
  const showCollapseTooltip = useCallback(() => {
    setCollapseTooltip(true);
  }, [setCollapseTooltip]);
  const hideCollapseTooltip = useCallback(() => {
    setCollapseTooltip(false);
  }, [setCollapseTooltip]);

  const prepareToClose = useCallback(() => {
    setCloseIntent(true);
    prepareToCloseFrame(panelIndex, stackIndex, true);
  }, [setCloseIntent, prepareToCloseFrame, panelIndex, stackIndex]);
  const unprepareToClose = useCallback(() => {
    setCloseIntent(false);
    prepareToCloseFrame(panelIndex, stackIndex, false);
  }, [setCloseIntent, prepareToCloseFrame, panelIndex, stackIndex]);

  // Rendering all the content is slow
  // Memoize to prevent unnecessary re-renders
  const content = useMemo(() => (
    <Grid>
      <HeroBrowserContent element={element} hideTagName />
    </Grid>
  ), [element]);

  // What a terrible API
  const offsetPopper = { popper: { popperOptions: { modifiers: [{ name: 'offset', options: { offset: [0, -8] } }] } } };

  const frameLocation = useMemo(() => [panelIndex, stackIndex], [panelIndex, stackIndex]);
  const frameBorderRed = useMemo(() => closeIntent || parentCloseIntent, [closeIntent, parentCloseIntent]);
  const [frameBorderPink, setFrameBorderPink] = useState(false);

  useEffect(() => {
    if (scrollIntoView) {
      scrollFrameIntoView(panelIndex, stackIndex);
      setFrameBorderPink(true);
      setTimeout(() => {
        setFrameBorderPink(false);
      }, 750);
    }
  }, [scrollIntoView, panelIndex, stackIndex, setFrameBorderPink]);

  return (
    <HeroFrameContext.Provider value={frameLocation}>
      <Frame ref={ref} frameBorderRed={frameBorderRed} frameBorderPink={frameBorderPink}>
        <Grid container direction='column' flexWrap='nowrap'>
          <Grid>
            <Grid container flexWrap='nowrap' alignItems='center' justifyContent='space-between' columnSpacing={2}>
              <Grid>
                <Grid container flexWrap='nowrap' alignItems='center' columnSpacing={1}>
                  <Grid>
                    <Tooltip
                      title={collapse ? 'Expand' : 'Collapse'}
                      placement='right'
                      disableInteractive
                      slotProps={offsetPopper}
                      open={collapseTooltip}
                      onOpen={showCollapseTooltip}
                      onClose={hideCollapseTooltip}
                    >
                      <IconButton
                        size='small'
                        disabled={forceCollapseAll}
                        onClick={toggleCollapse}
                      >
                        {(collapse || forceCollapseAll) ? <KeyboardArrowRightIcon /> : <KeyboardArrowUpIcon />}
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid>
                    <ClickableTag element={element} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid>
                <Grid container flexWrap='nowrap' columnSpacing={0.5}>
                  {/* <Grid>
                    <Tooltip
                      title='Rearrange'
                      placement='right'
                      disableInteractive
                      slotProps={offsetPopper}
                    >
                      <IconButton size='small'>
                        <SwapVertIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid> */}
                  {/* <Grid>
                  <Tooltip
                    title='Jump to Parent'
                    placement='right'
                    disableInteractive
                    slotProps={offsetPopper}
                  >
                    <IconButton size='small'>
                      <KeyboardDoubleArrowLeftIcon />
                    </IconButton>
                  </Tooltip>
                </Grid> */}
                  <Grid>
                    <Tooltip
                      title='Close'
                      placement='right'
                      disableInteractive
                      slotProps={offsetPopper}
                    >
                      <IconButton
                        size='small'
                        color={closeIntent ? 'error' : 'default'}
                        sx={{ transition: 'color ease 0.2s' }}
                        onMouseEnter={prepareToClose}
                        onMouseLeave={unprepareToClose}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Collapse in={!collapse && !forceCollapseAll}>
            {content}
          </Collapse>
        </Grid>
      </Frame>
    </HeroFrameContext.Provider>
  );
}

export default HeroBrowserFrame;
