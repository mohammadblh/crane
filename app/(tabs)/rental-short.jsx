import React from 'react';
import { useApp } from '../../contexts/AppContext';
import Loading from '../../components/Loading';
import RentalRender from '../../components/FormRenderer/RentalRender';

export default function RentalShortScreen() {
    const { rentalShort } = useApp();

    if (!rentalShort) return <Loading />;

    return (
        <RentalRender rental={rentalShort} />
    );
}