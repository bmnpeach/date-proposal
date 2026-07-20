declare module 'lucide-react' {
  import * as React from 'react';

  interface IconProps extends React.SVGAttributes<SVGElement> {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    defaultStrokeWidth?: number | string;
  }

  interface LucideProps extends IconProps {
    fill?: string;
    stroke?: string;
  }

  export type Icon = React.ForwardRefExoticComponent<LucideProps>;

  export const Heart: Icon;
}
