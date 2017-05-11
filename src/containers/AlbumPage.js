const { Component, h } = require('preact') /** @jsx h */

const entity = require('../entity')
const store = require('../store')
const { getArtistByName, getAlbum } = require('../store-getters')

const Album = require('../components/Album')
const Link = require('../components/Link')
const Loader = require('../components/Loader')
const Sheet = require('../components/Sheet')
const TrackList = require('../components/TrackList')

class AlbumPage extends Component {
  componentDidMount () {
    this._fetch()
  }

  componentWillReceiveProps (nextProps) {
    if (!entity.equal(this.props.entity, nextProps.entity)) this._fetch()
  }

  _fetch () {
    const { entity } = store
    store.dispatch('FETCH_ALBUM_INFO', entity)
  }

  render (props) {
    const { entity } = store
    const album = getAlbum(entity.url)

    if (!album || !album.images) {
      return <Sheet><Loader center /></Sheet>
    }

    let $content = <Loader />

    const artist = getArtistByName(album.artistName)

    if (album.tracks.length > 0) {
      $content = <TrackList class='mt4' tracks={album.tracks} />
    }

    return (
      <Sheet>
        <div class='cf'>
          <Album
            class='fl w-30 pr4'
            album={album}
            sizeHint='30vw'
            showName={false}
            showArtistName={false}
            showLink={false}
          />
          <div class='fl w-50'>
            <h5 class='tracked ttu'>Album</h5>
            <h1>{album.name}</h1>
            <h4>By <Link href={artist.url}>{artist.name}</Link></h4>
            <div class='lh-copy measure'>
              {album.summary}
            </div>
          </div>
        </div>
        {$content}
      </Sheet>
    )
  }
}

module.exports = AlbumPage
