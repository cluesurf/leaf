import React, { useEffect, useState } from 'react';
import { NavigationOverlay, bindTrigger, checkScrollDirectionIsUp, } from './utility';
import { ViewportLayoutFill } from '../ViewportGrid';
import cx from 'classnames';
import { useViewportLayoutFill } from '../../hook/useViewportLayout';
function Nav({ children }) {
    return (<div className="items-center justify-between w-full z-1000 flex h-full">
      {children}
    </div>);
}
function Container({ backgroundClassName, children, forceShadow, drop, }) {
    const layout = useViewportLayoutFill();
    return (<ViewportLayoutFill className={`h-72 appearance-none flex justify-between items-center w-full pointer-events-none`} state={layout} backgroundClassName={cx(backgroundClassName, `bg-white dark:bg-gray-900 fixed bottom-0 z-1000 ${!drop || forceShadow ? `dark:shadow-3xl-dark shadow-3xl` : ''}`)}>
      {children}
    </ViewportLayoutFill>);
}
export function NavigationBottom(props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    const [showMenu, setShowMenu] = useState(false);
    const [fadeMenu, setFadeMenu] = useState(false);
    const [dropMenu, setDropMenu] = useState(true);
    const [panel, setPanel] = useState();
    useEffect(() => {
        const handleScroll = (event) => {
            if (window.scrollY === 0) {
                setDropMenu(true);
                setFadeMenu(false);
            }
            else if (dropMenu) {
                setDropMenu(false);
            }
            if (checkScrollDirectionIsUp(event)) {
                setFadeMenu(false);
            }
            else {
                setFadeMenu(true);
            }
        };
        window.addEventListener('wheel', handleScroll);
        return () => {
            window.removeEventListener('wheel', handleScroll);
        };
    }, [dropMenu, setDropMenu, setFadeMenu]);
    useEffect(() => {
        if (showMenu) {
            document.body.classList.add('stop-scrolling');
        }
        else {
            document.body.classList.remove('stop-scrolling');
        }
        return () => {
            document.body.classList.remove('stop-scrolling');
        };
    }, [showMenu]);
    const trigger = {};
    if (props.x) {
        trigger.x = bindTrigger((_a = props.x.form) !== null && _a !== void 0 ? _a : 'panel', props.x.trigger, setPanel, props.x.element);
    }
    else {
        if (props.a) {
            trigger.a = bindTrigger((_b = props.a.form) !== null && _b !== void 0 ? _b : 'panel', props.a.trigger, setPanel, props.a.element);
        }
        if (props.b) {
            trigger.b = bindTrigger((_c = props.b.form) !== null && _c !== void 0 ? _c : 'panel', props.b.trigger, setPanel, props.b.element);
        }
        if (props.c) {
            trigger.c = bindTrigger((_d = props.c.form) !== null && _d !== void 0 ? _d : 'panel', props.c.trigger, setPanel, props.c.element);
        }
        if (props.d) {
            trigger.d = bindTrigger((_e = props.d.form) !== null && _e !== void 0 ? _e : 'panel', props.d.trigger, setPanel, props.d.element);
        }
        if (props.e) {
            trigger.e = bindTrigger((_f = props.e.form) !== null && _f !== void 0 ? _f : 'panel', props.e.trigger, setPanel, props.e.element);
        }
    }
    return (<Container backgroundClassName={props.backgroundClassName} forceShadow={props.forceShadow} drop={dropMenu}>
      <Nav>
        {trigger.x ? (trigger.x) : (<>
            {(_g = trigger.a) !== null && _g !== void 0 ? _g : <div />}
            {(_h = trigger.b) !== null && _h !== void 0 ? _h : <div />}
            {(_j = trigger.c) !== null && _j !== void 0 ? _j : <div />}
            {(_k = trigger.d) !== null && _k !== void 0 ? _k : <div />}
            {(_l = trigger.e) !== null && _l !== void 0 ? _l : <div />}
          </>)}
      </Nav>
      {panel && (<NavigationOverlay onClose={() => setPanel(undefined)} triggerPosition="bottom">
          {panel}
        </NavigationOverlay>)}
    </Container>);
}
//# sourceMappingURL=Bottom.jsx.map