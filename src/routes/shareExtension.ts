import {registerPlugin} from '@capacitor/core';

    
const _pluginName: string = 'ShareExtensionDataPlugin';

export class ShareData {
    item : ShareDataItem = new ShareDataItem();
}


export class ShareDataItem {
    url: string = '';
    image: string = '';
}

export interface ShareEXtentionDataPlugin {
    read(): Promise<ShareData>;
}

export const ShareExtensionDataPlugin = registerPlugin<ShareEXtentionDataPlugin>(_pluginName);
