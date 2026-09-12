import React from 'react';
import GlobalPlatformPreloader from '../GlobalPlatformPreloader';

/**
 * Landing Page Preloader component wrapper
 * Delegates to GlobalPlatformPreloader for a unified, high-tech brand loading animation.
 * Features: 3D Golden Shield Emblem + Kinetic "JOY TRUE PROFILE" + "INSTANT WORKFORCE VERIFICATION"
 * Eliminates all green circular radar rings and static double preloader flashes.
 */
export default function LandingPagePreloader({ onFinish }) {
  return (
    <GlobalPlatformPreloader 
      onFinish={onFinish} 
      subtitleText="INSTANT WORKFORCE VERIFICATION"
      isFullScreen={true}
      autoDismissMs={2200}
    />
  );
}


