import { WSParsedMessage } from '@/types/WS';

import { jsonUtils } from './utils';

const WSMessageParser = {
  parse(message: string): WSParsedMessage | string | null {
    if (typeof message !== 'string') {
      return message;
    }

    if (isNaN(parseInt(message[0], 10))) {
      return message;
    }

    message = message.trim();

    const unexpectedSeparator = '';
    const weirdCharIndex = message.indexOf(unexpectedSeparator);
    if (weirdCharIndex !== -1) {
      message = message.substring(0, weirdCharIndex);
    }

    const startIndex = message.indexOf('[');
    if (startIndex === -1) {
      return message;
    }

    const messageCode = parseInt(message.substring(0, startIndex), 10);
    const jsonString = message.substring(startIndex);
    let data: any[] = [];

    data = jsonUtils.safeParse(jsonString);

    if (!Array.isArray(data)) {
      console.error('Parsed data is not in the expected format');
      return null;
    }

    let output: WSParsedMessage;

    if (data.length < 2) {
      output = {
        messageCode,
        event: '',
        data,
      };
    } else {
      const [event, ...eventData] = data;
      output = {
        messageCode,
        event,
        data: eventData,
      };
    }

    return output;
  },
  stringify(parsedMessage: WSParsedMessage | string): string {
    if (!parsedMessage || typeof parsedMessage !== 'object') {
      return parsedMessage as string;
    }

    let { data } = parsedMessage as WSParsedMessage;
    const { messageCode, event } = parsedMessage as WSParsedMessage;

    if (!Array.isArray(data)) {
      data = [data];
    }

    const eventData = JSON.stringify([event, ...data]);
    const stringifiedMessage = `${messageCode}${eventData}`;

    return stringifiedMessage;
  },
};

export { WSMessageParser };
