import { Img } from '@react-email/components';
import * as React from 'react';

export interface IBlockPreviewProps {
    src: string
}

export default function BlockPreview ({src}: IBlockPreviewProps) {
  return (
    <Img src={src} style={{width: '100%',maxWidth: '600px'}} className='inline-block cursor-grab'/>
  );
}
