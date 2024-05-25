import React from 'react'
import AdminHeader from '../Layout/AdminHeader'
import AddClientForm from './AddClientForm';

function ClientOnboarding() {
  return (
    <div>
      <AdminHeader />

<AddClientForm newClientTitle={"Client Onboarding Form"}/>


    </div>
  );
}

export default ClientOnboarding
