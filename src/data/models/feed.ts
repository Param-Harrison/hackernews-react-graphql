import { debug } from 'debug';

import { cache } from '../cache';
import * as HNDB from '../hn-data-api';
import { sampleData } from '../sample-data';

const logger = debug('app:Feed');
logger.log = console.log.bind(console);

export enum FeedType {
  TOP = 'TOP',
  NEW = 'NEW',
  BEST = 'BEST',
  SHOW = 'SHOW',
  ASK = 'ASK',
  JOB = 'JOB',
}

class Feed {
  public getForType(type: FeedType, first: number, skip: number) {
    logger(`Get first ${first} ${type} stories skip ${skip}.`);

    switch (type) {
      case 'TOP':
        // In this app the HN data is reconstructed in-memory
        return Promise.all(
          this.top.slice(skip, first + skip).map(id => cache.getNewsItem(id) || HNDB.fetchNewsItem(id))
        );
      case 'NEW':
        return Promise.all(
          this.new.slice(skip, first + skip).map(id => cache.getNewsItem(id) || HNDB.fetchNewsItem(id))
        );
      case 'BEST':
        return Promise.all(
          this.best.slice(skip, first + skip).map(id => cache.getNewsItem(id) || HNDB.fetchNewsItem(id))
        );
      case 'SHOW':
        return this.showNewsItems.slice(skip, first + skip);
      case 'ASK':
        return this.askNewsItems.slice(skip, first + skip);
      case 'JOB':
        return this.jobNewsItems.slice(skip, first + skip);
      default:
        return sampleData.newsItems.slice(skip, skip + first);
    }
  }

  /* Arrays of post ids in descending rank order */
  top = sampleData.top;
  new = sampleData.new;
  best = [];
  show = [];
  ask = [];
  job = [];

  /* A pre constructed cache of news feeds */
  topNewsItems = sampleData.topStoriesCache;
  newNewsItems = sampleData.topStoriesCache;
  bestNewsItems = sampleData.topStoriesCache;
  showNewsItems = sampleData.topStoriesCache;
  askNewsItems = sampleData.topStoriesCache;
  jobNewsItems = sampleData.topStoriesCache;
}

export const FeedSingleton = new Feed();
