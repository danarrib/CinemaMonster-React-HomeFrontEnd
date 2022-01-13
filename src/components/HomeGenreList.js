import React from 'react';
import PropTypes from 'prop-types';
import { CNav, CNavItem, CNavLink } from '@coreui/react';

class HomeGenreList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const lstGenres = this.props.genreslist;
    const colGenres = lstGenres.map(function(genre) {
      return (
        <CNavItem key={ genre.id }>
          <CNavLink href={ "/moviegenre/" + genre.id }>{genre.name}</CNavLink>
        </CNavItem>
      );
    });

    return (
      <div data-testid="HomeGenreList">
        <CNav>
          {colGenres}
        </CNav>
      </div>
    );
  }
}

HomeGenreList.propTypes = {};

HomeGenreList.defaultProps = {};

export default HomeGenreList;
