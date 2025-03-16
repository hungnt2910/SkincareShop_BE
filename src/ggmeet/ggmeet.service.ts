import { Injectable } from '@nestjs/common'
import { google } from 'googleapis'
import * as fs from 'fs'
import * as path from 'path'

const auth = new google.auth.OAuth2({
  clientId: '51849457540-v768t7qlium5dj5p7obue7qc11ud1d2i.apps.googleusercontent.com',
  clientSecret: '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',
  redirectUri: 'http://localhost:5001/ggmeet'
})

const scopes = ['https://www.googleapis.com/auth/calendar']

@Injectable()
export class GoogleService {
  private oauth2Client
  private calendar

  constructor() {
    this.oauth2Client = new google.auth.OAuth2({
      clientId: '51849457540-v768t7qlium5dj5p7obue7qc11ud1d2i.apps.googleusercontent.com',
      clientSecret: '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',
      redirectUri: 'http://localhost:5001/ggmeet'
    })
  }

  getAuthUrl() {
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar']
    })
    return authUrl
  }

  async createGoogleCalendarEvent() {
    const listLink = ['meet.google.com/jrn-xekj-xds', 'meet.google.com/raj-ptww-nbv', 'meet.google.com/rxp-itdu-aeg']

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
      "meet.google.com/jrn-xekj-xds",
      "meet.google.com/raj-ptww-nbv",
      "meet.google.com/rxp-itdu-aeg"
    ]
  
    // const cleanedUrl = url.trim().toLowerCase()
    // console.log(`Checking URL: "${cleanedUrl}"`)
  
    const found = listLink.includes(cleanURL)
    console.log('List contains:', found)
  
    return found ? cleanURL : null
  }
}
