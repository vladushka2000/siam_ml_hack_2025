
import { observer } from 'mobx-react-lite';
import { useRef, useState } from 'react';
import { Button } from '@consta/uikit/Button';
import { Layout } from '@consta/uikit/Layout';
import { Text } from '@consta/uikit/Text';
import { Tooltip } from '@consta/uikit/Tooltip';

import "../styles/layout.css";
import { timeSeriesStore } from '../../../../widgets/time-series/store/timeSeriesStore';
import { mainPageStore } from '../../stores/mainPageStore';

export const TimeSeriesControl = observer(() => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);

  return (
    <Layout direction='row' className='time-series-control'>
      <Button
        label='Новый анализ'
        type='button'
        onClick={() => {
          mainPageStore.makeNewAnalyze();
        }}
        ref={anchorRef}
      />
      <Button
        label='Результаты анализа'
        type='button'
        onClick={() => {setIsTooltipVisible(!isTooltipVisible)}}
        ref={anchorRef}
      />
      <Tooltip
        isOpen={isTooltipVisible}
        direction='upCenter'
        spareDirection='downStartLeft'
        anchorRef={anchorRef}
        size='m' key={undefined} slot={undefined} style={undefined} title={undefined} className={undefined} tabIndex={undefined} onClick={undefined} status={undefined} possibleDirections={undefined} isInteractive={undefined} onClickOutside={undefined} offset={undefined} onSetDirection={undefined} viewportRef={undefined} equalAnchorWidth={undefined} position={undefined} defaultChecked={undefined} defaultValue={undefined} suppressContentEditableWarning={undefined} suppressHydrationWarning={undefined} accessKey={undefined} contentEditable={undefined} contextMenu={undefined} dir={undefined} draggable={undefined} hidden={undefined} id={undefined} lang={undefined} placeholder={undefined} spellCheck={undefined} translate={undefined} radioGroup={undefined} role={undefined} about={undefined} datatype={undefined} inlist={undefined} prefix={undefined} property={undefined} resource={undefined} typeof={undefined} vocab={undefined} autoCapitalize={undefined} autoCorrect={undefined} autoSave={undefined} color={undefined} itemProp={undefined} itemScope={undefined} itemType={undefined} itemID={undefined} itemRef={undefined} results={undefined} security={undefined} unselectable={undefined} inputMode={undefined} is={undefined} aria-activedescendant={undefined} aria-atomic={undefined} aria-autocomplete={undefined} aria-busy={undefined} aria-checked={undefined} aria-colcount={undefined} aria-colindex={undefined} aria-colspan={undefined} aria-controls={undefined} aria-current={undefined} aria-describedby={undefined} aria-details={undefined} aria-disabled={undefined} aria-dropeffect={undefined} aria-errormessage={undefined} aria-expanded={undefined} aria-flowto={undefined} aria-grabbed={undefined} aria-haspopup={undefined} aria-hidden={undefined} aria-invalid={undefined} aria-keyshortcuts={undefined} aria-label={undefined} aria-labelledby={undefined} aria-level={undefined} aria-live={undefined} aria-modal={undefined} aria-multiline={undefined} aria-multiselectable={undefined} aria-orientation={undefined} aria-owns={undefined} aria-placeholder={undefined} aria-posinset={undefined} aria-pressed={undefined} aria-readonly={undefined} aria-relevant={undefined} aria-required={undefined} aria-roledescription={undefined} aria-rowcount={undefined} aria-rowindex={undefined} aria-rowspan={undefined} aria-selected={undefined} aria-setsize={undefined} aria-sort={undefined} aria-valuemax={undefined} aria-valuemin={undefined} aria-valuenow={undefined} aria-valuetext={undefined} dangerouslySetInnerHTML={undefined} onCopy={undefined} onCopyCapture={undefined} onCut={undefined} onCutCapture={undefined} onPaste={undefined} onPasteCapture={undefined} onCompositionEnd={undefined} onCompositionEndCapture={undefined} onCompositionStart={undefined} onCompositionStartCapture={undefined} onCompositionUpdate={undefined} onCompositionUpdateCapture={undefined} onFocus={undefined} onFocusCapture={undefined} onBlur={undefined} onBlurCapture={undefined} onChange={undefined} onChangeCapture={undefined} onBeforeInput={undefined} onBeforeInputCapture={undefined} onInput={undefined} onInputCapture={undefined} onReset={undefined} onResetCapture={undefined} onSubmit={undefined} onSubmitCapture={undefined} onInvalid={undefined} onInvalidCapture={undefined} onLoad={undefined} onLoadCapture={undefined} onError={undefined} onErrorCapture={undefined} onKeyDown={undefined} onKeyDownCapture={undefined} onKeyPress={undefined} onKeyPressCapture={undefined} onKeyUp={undefined} onKeyUpCapture={undefined} onAbort={undefined} onAbortCapture={undefined} onCanPlay={undefined} onCanPlayCapture={undefined} onCanPlayThrough={undefined} onCanPlayThroughCapture={undefined} onDurationChange={undefined} onDurationChangeCapture={undefined} onEmptied={undefined} onEmptiedCapture={undefined} onEncrypted={undefined} onEncryptedCapture={undefined} onEnded={undefined} onEndedCapture={undefined} onLoadedData={undefined} onLoadedDataCapture={undefined} onLoadedMetadata={undefined} onLoadedMetadataCapture={undefined} onLoadStart={undefined} onLoadStartCapture={undefined} onPause={undefined} onPauseCapture={undefined} onPlay={undefined} onPlayCapture={undefined} onPlaying={undefined} onPlayingCapture={undefined} onProgress={undefined} onProgressCapture={undefined} onRateChange={undefined} onRateChangeCapture={undefined} onSeeked={undefined} onSeekedCapture={undefined} onSeeking={undefined} onSeekingCapture={undefined} onStalled={undefined} onStalledCapture={undefined} onSuspend={undefined} onSuspendCapture={undefined} onTimeUpdate={undefined} onTimeUpdateCapture={undefined} onVolumeChange={undefined} onVolumeChangeCapture={undefined} onWaiting={undefined} onWaitingCapture={undefined} onAuxClick={undefined} onAuxClickCapture={undefined} onClickCapture={undefined} onContextMenu={undefined} onContextMenuCapture={undefined} onDoubleClick={undefined} onDoubleClickCapture={undefined} onDrag={undefined} onDragCapture={undefined} onDragEnd={undefined} onDragEndCapture={undefined} onDragEnter={undefined} onDragEnterCapture={undefined} onDragExit={undefined} onDragExitCapture={undefined} onDragLeave={undefined} onDragLeaveCapture={undefined} onDragOver={undefined} onDragOverCapture={undefined} onDragStart={undefined} onDragStartCapture={undefined} onDrop={undefined} onDropCapture={undefined} onMouseDown={undefined} onMouseDownCapture={undefined} onMouseEnter={undefined} onMouseLeave={undefined} onMouseMove={undefined} onMouseMoveCapture={undefined} onMouseOut={undefined} onMouseOutCapture={undefined} onMouseOver={undefined} onMouseOverCapture={undefined} onMouseUp={undefined} onMouseUpCapture={undefined} onSelect={undefined} onSelectCapture={undefined} onTouchCancel={undefined} onTouchCancelCapture={undefined} onTouchEnd={undefined} onTouchEndCapture={undefined} onTouchMove={undefined} onTouchMoveCapture={undefined} onTouchStart={undefined} onTouchStartCapture={undefined} onPointerDown={undefined} onPointerDownCapture={undefined} onPointerMove={undefined} onPointerMoveCapture={undefined} onPointerUp={undefined} onPointerUpCapture={undefined} onPointerCancel={undefined} onPointerCancelCapture={undefined} onPointerEnter={undefined} onPointerEnterCapture={undefined} onPointerLeave={undefined} onPointerLeaveCapture={undefined} onPointerOver={undefined} onPointerOverCapture={undefined} onPointerOut={undefined} onPointerOutCapture={undefined} onGotPointerCapture={undefined} onGotPointerCaptureCapture={undefined} onLostPointerCapture={undefined} onLostPointerCaptureCapture={undefined} onScroll={undefined} onScrollCapture={undefined} onWheel={undefined} onWheelCapture={undefined} onAnimationStart={undefined} onAnimationStartCapture={undefined} onAnimationEnd={undefined} onAnimationEndCapture={undefined} onAnimationIteration={undefined} onAnimationIterationCapture={undefined} onTransitionEnd={undefined} onTransitionEndCapture={undefined}
      > {/* Баг */}
        <Text view='primary' lineHeight='m' size='s'>
          {
            Object.keys(timeSeriesStore.analyzeProperties).map((key) => {
              const typedKey = key as keyof typeof timeSeriesStore.analyzeProperties;
              return (
                <Text>
                  Параметр {key}: {
                    timeSeriesStore.analyzeProperties[typedKey] ?
                    timeSeriesStore.analyzeProperties[typedKey] :
                    '-'
                  }
                </Text>
              )
            })
          }
        </Text>
      </Tooltip>
    </Layout>
  )
});
