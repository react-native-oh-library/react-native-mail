/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

export type attachments = {
  path?: string; // Specify either 'path' or 'uri'
  uri?: string; // 以协议开头路径
  type?: string; // Specify either 'type' or 'mimeType'
  mimeType?: string;
  name?: string;
}

export type mainOptions = {
  subject?: string | '',
  recipients?: string[],
  ccRecipients?: string[],
  bccRecipients?: string[],
  body?: string | '',
  customChooserTitle?: string|'',
  isHTML?: boolean,
  attachments?: attachments[],
}