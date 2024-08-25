import React from 'react';
import cx from 'classnames';
export function ViewportLayout3Section({ className, left, leftClassName, middle, middleClassName, right, rightClassName, state, middleOverlay, scrollerRef, }) {
    return (<div className={cx(`absolute top-0 left-0 right-0 bottom-0`, className)} style={Object.assign({}, state.container)}>
      <div className="overflow-hidden" style={Object.assign({}, state.grid)}>
        <div className={leftClassName} style={Object.assign({ height: '100%' }, state.left)}>
          {left}
        </div>
        <div className={['z-2000 relative h-full flex flex-1'].join(' ')}>
          <div ref={scrollerRef} className={cx('max-w-888', middleOverlay ? 'overflow-y-hidden' : 'overflow-y-auto', middleClassName)} style={Object.assign({}, state.middle)}>
            {middle}
          </div>
          {middleOverlay && (<div className={cx('max-w-888', 'absolute left-0 z-1000 right-0 top-0 bottom-0')} style={Object.assign({}, state.middle)}>
              {middleOverlay}
            </div>)}
        </div>
        <div className={rightClassName} style={Object.assign({ height: '100%' }, state.right)}>
          {right}
        </div>
      </div>
    </div>);
}
export function ViewportLayoutSplit({ className, left, right, state, leftBackgroundClassName, rightBackgroundClassName, }) {
    return (<div className="flex justify-center">
      <div style={Object.assign({}, state.container)} className={['w-full', className].filter(x => x).join(' ')}>
        <div className={[
            'flex',
            state.container.flexDirection === 'column'
                ? 'w-full'
                : 'w-2/4',
            'justify-center',
            'items-center',
            leftBackgroundClassName,
        ].join(' ')}>
          <div className={['w-full'].join(' ')} style={Object.assign({ minHeight: 'calc(100vh - 64px)' }, state.left)}>
            {left}
          </div>
        </div>
        <div className={[
            'flex',
            state.container.flexDirection === 'column'
                ? 'w-full'
                : 'w-2/4',
            'justify-center',
            'items-center',
            rightBackgroundClassName,
        ].join(' ')}>
          <div className={['w-full'].join(' ')} style={Object.assign({ minHeight: 'calc(100vh - 64px)' }, state.right)}>
            {right}
          </div>
        </div>
      </div>
    </div>);
}
export function ViewportLayoutBase({ children, className, }) {
    return (<div className={['flex justify-center'].join(' ')}>
      <div className={[className, 'max-w-888', 'w-full', 'p-16'].join(' ')}>
        {children}
      </div>
    </div>);
}
export function ViewportLayoutFill({ children, className, backgroundClassName, state, }) {
    return (<div className={[backgroundClassName].join(' ')} style={state.container}>
      <div className={[className].join(' ')} style={state.grid}>
        {children}
      </div>
    </div>);
}
//# sourceMappingURL=ViewportGrid.jsx.map