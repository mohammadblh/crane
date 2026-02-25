import React from 'react';
import { useApp } from '../../contexts/AppContext';
import Loading from '../../components/Loading';
import RentalRender from '../../components/FormRenderer/RentalRender';

export default function RentalLongScreen() {
    const { rentalLong } = useApp();

    if (!rentalLong) return <Loading />;

    return (
        <RentalRender rental={rentalLong} />
    );
}