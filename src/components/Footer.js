import React from 'react';
import PropTypes from 'prop-types';
import { CFooter, CLink } from '@coreui/react';


const Footer = () => (
  <div data-testid="Footer">
      <CFooter>
        <div>
          <strong>Cinema Monster</strong> is a technology demonstrator system made by <a className="text-decoration-none" href="https://www.github.com/danarrib/">Daniel Ribeiro</a>.
        </div>
        <div>
          Check out project description <CLink>here</CLink>
        </div>
      </CFooter>
  </div>
);

Footer.propTypes = {};

Footer.defaultProps = {};

export default Footer;
