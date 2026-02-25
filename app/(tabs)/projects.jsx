import React from 'react';
import { useApp } from '../../contexts/AppContext';
import Loading from '../../components/Loading';
import RentalRender from '../../components/FormRenderer/RentalRender';

export default function RentalProjectScreen() {
    const { rentalProject } = useApp();

    if (!rentalProject) return <Loading />;

    return (
        <RentalRender rental={rentalProject} />
    );
}