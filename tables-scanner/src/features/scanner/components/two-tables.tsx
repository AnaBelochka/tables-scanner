'use client';

import React from 'react';
import { Filters, Table } from './components';
import { useScanner } from '../hooks';

export const TwoTables = () => {
  useScanner('trending');
  useScanner('new');

  return (
    <div className="space-y-3 p-4">
      <Filters />
      <div className="flex flex-col">
        <Table
          title="Trending Tokens"
          type="trending"
          defaultSort={{ id: 'volumeUsd24h', desc: true }}
        />
        <Table title="New Tokens" type="new" defaultSort={{ id: 'age', desc: false }} />
      </div>
    </div>
  );
};
