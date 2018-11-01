import React from 'react';

import LayoutContained from './../../layouts/layout-contained/layout-contained';
import PreNavigation from './../../navigation/secondary-navigation/secondary-navigation';
import Navigation from './../../navigation/main-navigation/main-navigation';
import UserMenu from './../user-menu/user-menu';

class HeaderNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.expandable = React.createRef();
    this.state = {
      open: false
    };
  }

  handleOpen = () => {
    this.setState({ open: !this.state.open });
  };

  handleOption = newOption => {
    this.setState({ option: newOption });
  };

  handleOutsideClick = event => {
    if (this.state.open && !this.expandable.current.contains(event.target)) {
      this.setState({ open: false });
    }
  };

  // puts an event listener for the UI handling (not that unsafe)
  componentDidMount() {
    if (typeof document !== 'undefined')
      document.addEventListener('mousedown', this.handleOutsideClick, false);
  }

  // remove the listener in absence of the component
  ComponentWillUnmount() {
    if (typeof document !== 'undefined')
      document.removeEventListener('mousedown', this.handleOutsideClick, false);
  }

  handleKeyPress = e => {
    if (e.key === 'Enter') return this.handleOpen;
  };

  render() {
    const snapshot = { ...this.state };
    const isExpanded = snapshot.open;
    const stateClass = snapshot.open ? 'is-expanded' : 'is-collapsed';
    const isHidden = !snapshot.open;

    let classes = ['header__navigation-container'];
    if (stateClass) classes.push(stateClass);
    let classString = classes.join(' ');

    return (
      <div className="header__inner" ref={this.expandable}>
        <button
          onClick={this.handleOpen}
          onKeyPress={this.handleKeyPress}
          className="button button--header header__button"
          aria-controls={'header-navigation-container'}
          aria-expanded={isExpanded}
        >
          <span>Menu</span>
        </button>
        <div
          className={classString}
          id="header-navigation-container"
          hidden={isHidden}
        >
          <div className="header__bottom">
            <LayoutContained className="header__bottom-inner">
              <Navigation />
              <UserMenu />
            </LayoutContained>
          </div>
          <div className="header__top">
            <LayoutContained>
              <PreNavigation />
            </LayoutContained>
          </div>
        </div>
      </div>
    );
  }
}

export default HeaderNavigation;
