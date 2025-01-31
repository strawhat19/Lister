import React from 'react';
import { colors } from '../Themed';
import Svg, { Path, G } from 'react-native-svg';

const configurations = {
    onAppleBlue: {
        allWhite: {
            color: colors.white,
        },
        oreo: {
            color: colors.black,
            topLeftColor: colors.white,
            bottomRightColor: colors.white,
        },
        navySky: {
            color: colors.navy,
            topLeftColor: colors.skyBlue,
            bottomRightColor: colors.skyBlue,
        },
    },
}

export const defaultConfiguration: any = configurations.onAppleBlue.navySky;

export default function Logo({
    size = 50,
    color = defaultConfiguration.color,
    topLeftColor = defaultConfiguration.topLeftColor,
    topRightColor = defaultConfiguration.topRightColor,
    bottomLeftColor = defaultConfiguration.bottomLeftColor,
    bottomRightColor = defaultConfiguration.bottomRightColor,
}) {
    return (
        <Svg style={{ maxHeight: size, maxWidth: size }} width="492" height="414" viewBox="0 0 492 414" fill="none">
            <G>
                <Path
                    d="M79.16 341.82C72.87 335.99 66.57 330.18 60.3 324.33C45.44 310.48 30.48 296.74 15.79 282.71C-1.38002 266.31 -4.77002 242.76 6.76998 222.59C10.55 215.98 16.22 211.06 21.69 205.97C53.59 176.22 85.49 146.48 117.4 116.74C126.24 108.5 134.87 100 144.04 92.14C169.72 70.12 209.6 80.78 220.62 112.75C226.95 131.11 223.77 148.39 209.9 162.16C191.43 180.51 172 197.88 153.02 215.72C131.78 235.69 110.06 255.15 90.51 276.86C77.49 291.32 70.98 307.65 75.14 327.25C76.17 332.08 77.71 336.79 79.17 341.8L79.16 341.82Z"
                    fill={topLeftColor ?? color}
                />
                <Path
                    d="M174.58 413.73C161.68 413.33 150.89 408.73 141.77 400.32C125 384.86 108.35 369.27 91.67 353.72C90.68 352.8 89.59 351.96 89.1 350.58C85.01 339.19 81.06 327.81 81.42 315.41C81.75 303.71 86.11 293.57 93.05 284.47C101.72 273.1 112.41 263.73 123.37 254.64C125.32 253.02 126.5 253.59 128.08 255.07C149.73 275.35 171.46 295.54 193.08 315.85C200.06 322.41 207.62 328.4 213.6 335.98C231.4 358.52 224.31 393.16 199.21 407.09C191.37 411.44 183.03 413.35 174.59 413.73H174.58Z"
                    fill={bottomLeftColor ?? color}
                />
                <Path
                    d="M412.81 261.27C419.1 255.44 425.4 249.63 431.67 243.78C446.53 229.93 461.49 216.19 476.18 202.16C493.35 185.76 496.74 162.21 485.2 142.04C481.42 135.43 475.75 130.51 470.28 125.42C438.38 95.67 406.48 65.93 374.57 36.19C365.73 27.95 357.1 19.45 347.93 11.59C322.25 -10.43 282.37 0.230017 271.35 32.2C265.02 50.56 268.2 67.84 282.07 81.61C300.54 99.96 319.97 117.33 338.95 135.17C360.19 155.14 381.91 174.6 401.46 196.31C414.48 210.77 420.99 227.1 416.83 246.7C415.8 251.53 414.26 256.24 412.8 261.25L412.81 261.27Z"
                    fill={topRightColor ?? color}
                />
                <Path
                    d="M317.38 333.19C330.28 332.79 341.07 328.19 350.19 319.78C366.96 304.32 383.61 288.73 400.29 273.18C401.28 272.26 402.37 271.42 402.86 270.04C406.95 258.65 410.9 247.27 410.54 234.87C410.21 223.17 405.85 213.03 398.91 203.93C390.24 192.56 379.55 183.19 368.59 174.1C366.64 172.48 365.46 173.05 363.88 174.53C342.23 194.81 320.5 215 298.88 235.31C291.9 241.87 284.34 247.86 278.36 255.44C260.56 277.98 267.65 312.62 292.75 326.55C300.59 330.9 308.93 332.81 317.37 333.19H317.38Z"
                    fill={bottomRightColor ?? color}
                />
            </G>
        </Svg>
    );
}