import React from 'react'
import AdminHeader from '../Layout/AdminHeader'
import AddClient from './AddClientForm';

function ClientOnboarding() {
  return (
    <div>
      <AdminHeader />

      <AddClient newClientTitle={"Client Onboarding Form"} />
    </div>
  );
}

export default ClientOnboarding
