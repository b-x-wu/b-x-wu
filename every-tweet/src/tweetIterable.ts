import assert from 'assert'
import { type Binary } from 'mongodb'

export interface KeyBuffer {
  data: Binary
}

export class TweetIterable implements IterableIterator<string> {
  readonly MAX_TWEET_LENGTH: number = 280
  readonly BYTE_TO_CHAR_MAP: Map<number | undefined, string | null> = new Map<number | undefined, string | null>([
    [0, null],
    [undefined, null],
    [1, 'a'],
    [2, 'b'],
    [3, 'c'],
    [4, 'd'],
    [5, 'e'],
    [6, 'f'],
    [7, 'g'],
    [8, 'h'],
    [9, 'i'],
    [10, 'j'],
    [11, 'k'],
    [12, 'l'],
    [13, 'm'],
    [14, 'n'],
    [15, 'o'],
    [16, 'p'],
    [17, 'q'],
    [18, 'r'],
    [19, 's'],
    [20, 't'],
    [21, 'u'],
    [22, 'v'],
    [23, 'w'],
    [24, 'x'],
    [25, 'y'],
    [26, 'z'],
    [27, '!'],
    [28, '?'],
    [29, '#'],
    [30, '@'],
    [31, ' ']
  ])

  readonly keyBuffer: Buffer

  constructor (keyBuffer?: Buffer) {
    if (keyBuffer != null) {
      assert(keyBuffer.length === this.MAX_TWEET_LENGTH)
      this.keyBuffer = keyBuffer
      return
    }

    this.keyBuffer = Buffer.alloc(this.MAX_TWEET_LENGTH)
    this.keyBuffer.set([1], 0)
  }

  private _getCurrentTweetLength (): number {
    let count = 0
    for (let i = 0; i < this.MAX_TWEET_LENGTH; i++) {
      const val = this.keyBuffer.at(i)
      if (val == null || val === 0) break
      count++
    }
    return count
  }

  private _keyBufferToString (): string {
    let tweet: string = ''
    for (let i = 0; i < this.MAX_TWEET_LENGTH; i++) {
      const char = this.BYTE_TO_CHAR_MAP.get(this.keyBuffer.at(i))
      if (char == null) break
      tweet += char
    }
    return tweet
  }

  private _advanceKeyBuffer (): void {
    let place = 0
    while (true) {
      // all tweets have been iterated through
      if (place === this.MAX_TWEET_LENGTH) {
        this.keyBuffer.set([0], 0)
        return
      }

      // no need to carry
      const currentValue = this.keyBuffer.at(place)
      if (currentValue == null) throw new Error('Current value is undefined.')
      if (currentValue < 31) {
        this.keyBuffer.set([currentValue + 1], place)
        break
      }

      // carry
      this.keyBuffer.set([1], place)
      place++
    }

    // if the tweet starts a space, advance the key buffer again
    if (this.keyBuffer.at(0) === 31) {
      this._advanceKeyBuffer()
    }

    // if the tweet ends with a space, fast forward to all spaces and advance the key buffer
    const currentTweetLength = this._getCurrentTweetLength()
    if (this.keyBuffer.at(currentTweetLength - 1) === 31) {
      this.keyBuffer.fill(31, 0, currentTweetLength)
      this._advanceKeyBuffer()
    }
  }

  private _done (): boolean {
    const firstByte = this.keyBuffer.at(0)
    return firstByte == null || firstByte === 0
  }

  public next (): IteratorResult<string> {
    const tweet = this._keyBufferToString()
    this._advanceKeyBuffer()
    return {
      value: tweet,
      done: this._done()
    }
  }

  [Symbol.iterator] (): IterableIterator<string> { return this }
}
