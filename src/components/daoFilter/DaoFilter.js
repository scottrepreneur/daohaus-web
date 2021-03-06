import React, { useState, useEffect } from 'react';
import _ from 'lodash';

import DaoList from '../daoList/DaoList';

import './DaoFilter.scss';

const DaoFilter = ({ daos, version }) => {
  const [filteredDaos, setFilteredDaos] = useState();
  const [matchingDaos, setMatchingDaos] = useState();

  useEffect(() => {
    resetDaos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daos, version]);

  const sortAttribute = dao => {
    if (dao.apiData.length === 0) {
      return 0;
    } else {
      return dao.members.length;
    }
  };

  const resetDaos = () => {
    let unhidden = _.sortBy(baseFilter(daos), dao => {
      return sortAttribute(dao);
    }).reverse();

    setMatchingDaos(unhidden);
    setFilteredDaos(unhidden);
  };

  const baseFilter = daos => {
    return daos.filter(dao => {
      const notHidden = !dao.apiData.hide;
      const versionMatch = version === 'all' || +version === +dao.version;
      return notHidden && versionMatch;
    });
  };

  const handleChange = event => {
    if (event.target.value) {
      const filtered = _.sortBy(
        baseFilter(daos).filter(dao => {
          return (
            dao.title.toLowerCase().indexOf(event.target.value.toLowerCase()) >
            -1
          );
        }),
        dao => {
          return sortAttribute(dao);
        },
      ).reverse();

      setMatchingDaos(filtered);
      setFilteredDaos(filtered);
    } else {
      resetDaos();
    }
  };

  return (
    <div className="View">
      <div className="DaoFilter">
        <h3 className="DaoFilter__title">
          Daos ({matchingDaos && matchingDaos.length})
        </h3>
        <div className="DaoFilter__search">
          <input
            type="search"
            className="input"
            placeholder="Search Daos"
            onChange={e => handleChange(e)}
          />
        </div>
      </div>
      <div className="Block Primary Home__Daolist">
        {filteredDaos ? <DaoList daos={filteredDaos} /> : null}
      </div>
    </div>
  );
};

export default DaoFilter;
