import { SpotifyApi, type SimplifiedPlaylist } from "@spotify/web-api-ts-sdk"
import { useEffect, useState } from "react"
import type { SdkProps } from "../../middleware"
import Cookies from "js-cookie"

type PartialPlaylist = Pick<SimplifiedPlaylist, "id" | "name" | "images" | "tracks">
function createPlaylistPlaceholders(count: number): PartialPlaylist[] {
  return Array.from(Array(count).keys()).map(i => ({
    id: i.toString(),
    name: "Loading...",
    images: [], 
    tracks: {
      total: 0,
      href: "",
    }
  }))
}

function Pill({text, active = false}: {text: string, active?: boolean}) {
  return active ? <div className="text-sm font-thin text-black bg-neutral-100 py-1 px-3 rounded-2xl">{text}</div>  : <div className="text-sm font-thin text-gray-400 transition-colors bg-neutral-800 py-1 px-3 rounded-2xl duration-150 ease-in-out hover:text-white">{text}</div>
}

function LibraryTile({playlist}: {playlist: PartialPlaylist}) {
  const image = playlist?.images[0]?.url
  return <div className="flex flex-row w-full gap-2 h-12 cursor-pointer" onClick={() => { if(playlist) window.location.href = "/playlist-viewer/" + playlist.id}}>
    {image ?
     <img src={image} className="w-12 h-12 rounded-md" /> :
      <div className="w-12 h-12 rounded-md bg-gray-900 flex-shrink-0 text-gray-500">
        no image
      </div>
    }
    <div className="flex flex-col w-full overflow-hidden">
      <h2 className="text-base w-full overflow-hidden whitespace-nowrap text-ellipsis text-gray-400 transition-colors duration-150 ease-in-out hover:text-white">{playlist?.name ?? "No name"}</h2>
      <h3 className="text-sm font-thin text-gray-300">{playlist?.tracks?.total ?? 0} Songs</h3>
    </div>
  </div>
}

export default function Library({sdkProps, playlistCount = 4}: {sdkProps: SdkProps, playlistCount?: number}) {
  const [playlists, setPlaylists] = useState<PartialPlaylist[]>(createPlaylistPlaceholders(playlistCount || 4))
  const pills = ["Playlists", "Tags"]

  useEffect(() => {
    localStorage.getItem("sideNavPlaylists") && setPlaylists(JSON.parse(localStorage.getItem("sideNavPlaylists")!))

    try {
      const sdk = SpotifyApi.withAccessToken(sdkProps.clientId, sdkProps.token);
      sdk.currentUser.playlists.playlists().then(playlist => {
        localStorage.setItem("sideNavPlaylists", JSON.stringify(playlist.items))
        setPlaylists(playlist.items)
        Cookies.set("playlistCount", playlist.items.length.toString())
      })
    } catch(e) {
      document.location.href = "/?error=token_error"
    }
  }, [])

  return <div className="flex flex-col h-full">
    <h2 className="text-lg text-white">Your Library</h2>
    <div className="flex flex-row gap-4 mt-4">
      {pills.map((pill) => 
        <Pill key={pill} text={pill} active={pill === "Playlists"} />
      )}
    </div>
    <ul className="mt-4 flex-grow overflow-y-auto">
      {playlists.map((playlist: PartialPlaylist) => {
        return <li key={playlist.id} className="mb-3">
          <LibraryTile playlist={playlist} />
        </li>
      })}
    </ul>
  </div>
}