/**
 * MIT License
 *
 * Copyright (C) 2024 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { Want } from '@kit.AbilityKit';
import { BusinessError } from '@kit.BasicServicesKit';
import fileUri from '@ohos.file.fileuri';
import { TurboModule } from '@rnoh/react-native-openharmony/ts';
import { TM } from "@rnoh/react-native-openharmony/generated/ts";
import Logger from './Logger';
import { mainOptions } from './types';
import { supportedMimeTypes } from './constant';

const TAG = 'RNMail';

export class RNMailTurboModule extends TurboModule implements TM.RNMail.Spec {
  constructor(ctx) {
    super(ctx);
  }

  mail({ subject= '', recipients=[], body='', ccRecipients=[], bccRecipients=[] }: mainOptions, callback: Function) {
    let mailUri: string = '';
    mailUri += recipients?.join(',') || '';
    mailUri += '?cc=' + ccRecipients?.join(',') || '';
    mailUri += '&bcc=' + bccRecipients?.join(',') || '';
    mailUri += '&subject=' + subject;
    mailUri += '&body=' + encodeURIComponent(body);
    this.startEmailApp(mailUri, callback);
  }

  // 拉起应用
  startEmailApp = (mailUri, callback) => {
    let want: Want = {
      bundleName: 'com.huawei.hmos.email',
      abilityName: 'EntryAbility',
      moduleName: 'entry',
      uri: 'mailto:' + mailUri,
      action: 'ohos.want.action.viewData',
    };
    Logger.info(TAG + 'want ', JSON.stringify(want));

    try {
      this.ctx.uiAbilityContext.startAbility(want)
        .then(() => {
          Logger.info(TAG, 'startAbility success');
        })
        .catch((err: BusinessError) => {
          Logger.info(TAG, 'startAbility error.', err.message);
          callback(err.message);
        })
    } catch (e) {
      callback(e);
      Logger.info(TAG + 'error:', e);
    }
  }

  // 获取附件
  getAttachments(options, callback) {
    if (options.attachments && options.attachments.length > 0) {
      let attachments: {
        addAttachmentUri: string,
        mimeType: string,
        name: string,
      }[] = [];
      let mimeType: string = '';
      let uri: string = undefined;

      for (let i = 0; i < options.attachments.length; i++) {
        if (!options.attachments[i].name && options.attachments[i].path) {
          options.attachments[i].name = getFileName(options.attachments[i].path);
        }
        if (options.attachments[i].path) {
          // 将沙箱路径转换为uri
          uri = fileUri.getUriFromPath(options.attachments[i].path);
        } else if (options.attachments[i].uri) {
          uri = options.attachments[i].uri;
        }

        if (options.attachments[i].type) {
          if (!supportedMimeTypes[options.attachments[i].type]) {
            callback('Mime type ' + options.attachments[i].type + ' for attachment is not handled');
            return;
          }
          mimeType = supportedMimeTypes[options.attachments[i].type];
        } else if (options.attachments[i].mimeType) {
          mimeType = options.attachments[i].mimeType;
        }

        attachments.push({
          addAttachmentUri: uri,
          mimeType: mimeType,
          name: options.attachments[i]?.name,
        })
      }
      return attachments;
    }
  }
}

// 获取文件名
const getFileName = (path: string): string => {
  const index: number = path.lastIndexOf('/');
  return path.substr(index + 1);
}