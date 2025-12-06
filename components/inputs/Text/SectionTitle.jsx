import React from 'react';
import { Text } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { colorMap } from '../../../config/config';

export default function SectionTitle({ title, sx = {} }) {
    // Defaults
    const {
        color = 'gray-800',
        alignment = 'right',
        bold = true,
        size = 'base'
    } = sx;

    // Map Tailwind style dynamically
    const alignmentMap = {
        right: 'text-right',
        center: 'text-center',
        left: 'text-left'
    };

    const sizeMap = {
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl'
    };

    const fontWeight = bold ? 'font-bold' : 'font-normal';
    const textColor = colorMap[color] ? colorMap[color] : colorMap['gray-800'];

    return (
        <Text
            style={[
                tw`${alignmentMap[alignment] || 'text-right'} ${fontWeight} ${sizeMap[size] || 'text-base'} `,
                { color: textColor }
            ]}
        >
            {title}
        </Text>
    );
}
