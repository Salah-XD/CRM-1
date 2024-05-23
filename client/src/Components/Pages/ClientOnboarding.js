import React from 'react'
import AdminHeader from '../Layout/AdminHeader'
import AddClient from './AddClient';

function ClientOnboarding() {
  return (
    <div>
      <AdminHeader />

  <AddClient newClientTitle="Client Onboarding Form" />

    </div>
  );
}

export default ClientOnboarding
