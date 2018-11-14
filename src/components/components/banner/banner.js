import React from 'react';
import Img from 'gatsby-image';
import MediaQuery from 'react-responsive';
import Shape from './../shape/shape';

import './banner.scss';

export default props => {
  const text = props.text ? (
    <div className="banner__text"> {props.text} </div>
  ) : (
    ''
  );

  const title = props.title ? (
    <h1 className="title title--large">
      {props.title.map((titleElement, index) => (
        <span key={index}> {titleElement} </span>
      ))}
    </h1>
  ) : (
    ''
  );

  const targetClass = props.forPage ? `banner--${props.forPage}` : '';
  const classes = `banner ${targetClass}`;

  let hasShapes = false;
  if (
    props.forPage &&
    (props.forPage === 'about' || props.forPage === 'organizations')
  ) {
    hasShapes = true;
  }

  const bannerShapes = hasShapes
    ? [
        <Shape key="1" wave className="banner__wave" />,
        <Shape key="2" cube className="banner__cube" />,
        <Shape key="3" waveLarge className="banner__wave-large" />
      ]
    : '';

  return (
    <article className={classes}>
      <div className="banner__image-wrapper">
        <MediaQuery maxWidth={767}>
          <Img resolutions={props.imageMobile} className="banner__image" />
        </MediaQuery>
        <MediaQuery minWidth={768}>
          <Img fluid={props.image} className="banner__image" />
        </MediaQuery>
      </div>
      <div className="banner__content">
        <div className="banner__content-inner">
          {title}
          {text}
          {bannerShapes}
        </div>
      </div>
    </article>
  );
};
