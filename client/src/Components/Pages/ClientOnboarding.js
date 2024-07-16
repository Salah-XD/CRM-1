import React from 'react'
import AdminHeader from '../Layout/AdminHeader'
import AddClient from './AddClientForm';

function ClientOnboarding() {
  return (
    <div>
      <AdminHeader name="Unavar Client Portal" />

      <AddClient newClientTitle={"Client Details Form"} />
    </div>
  );
}

export default ClientOnboarding
