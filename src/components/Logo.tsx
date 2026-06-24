/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export default function Logo({ size = '100%', className, ...props }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Blue Rounded Background Card */}
      <rect x="120" y="50" width="260" height="400" rx="40" fill="#004baf" />
      
      {/* White Inner Border */}
      <rect
        x="130"
        y="60"
        width="240"
        height="380"
        rx="30"
        stroke="white"
        strokeWidth="8"
        fill="none"
      />

      {/* World Cup Trophy Silhouette */}
      <g id="trophy" fill="white">
        {/* Globe at the top */}
        <circle cx="250" cy="115" r="28" />

        {/* Flared Wings / Arms */}
        <path
          d="M 250,210 
             C 246,190 232,165 210,140 
             C 207,137 210,132 215,134 
             C 225,139 237,148 244,165 
             C 245,167 247,167 248,165 
             C 255,148 267,139 277,134 
             C 282,132 285,137 282,140 
             C 260,165 246,190 242,210 Z"
        />
        <path
          d="M 250,210 
             C 248,190 240,165 222,142 
             C 219,139 222,134 227,136 
             C 236,141 245,150 248,168 
             C 249,170 251,170 252,168 
             C 255,150 264,141 273,136 
             C 278,134 281,139 278,142 
             C 260,165 252,190 250,210 Z"
          opacity="0.9"
        />

        {/* Inner vertical lines/gap definition */}
        <path
          d="M 238,168 Q 244,190 246,210 L 243,210 Q 241,190 235,168 Z"
          fill="#004baf"
        />
        <path
          d="M 262,168 Q 256,190 254,210 L 257,210 Q 259,190 265,168 Z"
          fill="#004baf"
        />

        {/* Middle Band / Holder */}
        <path d="M 228,212 C 228,206 272,206 272,212 L 272,228 C 272,234 228,234 228,228 Z" />

        {/* Base Pillars / Body */}
        <path d="M 232,228 L 268,228 L 268,252 L 232,252 Z" />
        
        {/* Horizontal Malachite Rings (represented as background-colored cuts) */}
        <rect x="230" y="234" width="40" height="3" fill="#004baf" />
        <rect x="230" y="244" width="40" height="3" fill="#004baf" />

        {/* Tiered Base Stand */}
        <path d="M 224,252 L 276,252 C 276,260 270,268 270,268 L 230,268 C 230,268 224,260 224,252 Z" />
        <path d="M 216,268 L 284,268 C 284,282 280,286 280,286 L 220,286 C 220,286 216,282 216,268 Z" />
      </g>

      {/* Styled Serif Italic Logo Text */}
      <g
        fill="white"
        fontFamily="Georgia, Cambria, 'Times New Roman', Times, serif"
        fontWeight="900"
        fontStyle="italic"
        textAnchor="middle"
      >
        <text x="250" y="325" fontSize="36" letterSpacing="1">
          2026
        </text>
        <text x="250" y="360" fontSize="25" letterSpacing="0.5">
          World Cup
        </text>
        <text x="250" y="392" fontSize="23" letterSpacing="0.5">
          Stadium
        </text>
        <text x="250" y="422" fontSize="23" letterSpacing="0.5">
          Guide
        </text>
      </g>
    </svg>
  );
}
