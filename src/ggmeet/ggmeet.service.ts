import { Injectable } from '@nestjs/common'
import { google } from 'googleapis'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class GoogleService {
  private oauth2Client
  private calendar

  constructor() {}

  async createGoogleCalendarEvent() {
    const listLink = [
      'meet.google.com/jrn-xekj-xds',
      'meet.google.com/raj-ptww-nbv',
      'meet.google.com/rxp-itdu-aeg',
      'meet.google.com/apo-nqvf-rnu',
      'meet.google.com/eee-gudk-xck',
      'meet.google.com/vgy-brwy-fpn',
      'meet.google.com/oqz-eisq-nwr'
    ]

    try {
      const randomLink = listLink[Math.floor(Math.random() * listLink.length)]
      return randomLink
    } catch (error) {
      console.error('Error selecting random link:', error)
      return 'https://meet.google.com/default'
    }
  }

  checkAndReturnURL(url: any) {
    const cleanURL = url.url
    // if (typeof url !== 'string') {
    //   console.log('Invalid URL:', url)
    //   return null
    // }

    const listLink = [
      'meet.google.com/jrn-xekj-xds',
      'meet.google.com/raj-ptww-nbv',
      'meet.google.com/rxp-itdu-aeg',
      'meet.google.com/apo-nqvf-rnu',
      'meet.google.com/eee-gudk-xck',
      'meet.google.com/vgy-brwy-fpn',
      'meet.google.com/oqz-eisq-nwr'
    ]

    // const cleanedUrl = url.trim().toLowerCase()
    // console.log(`Checking URL: "${cleanedUrl}"`)

    const found = listLink.includes(cleanURL)
    console.log('List contains:', found)

    return found ? cleanURL : null
  }
}
