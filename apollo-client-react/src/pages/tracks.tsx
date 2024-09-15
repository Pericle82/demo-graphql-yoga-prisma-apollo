import React from "react";
import Layout from "../components/layout";
import { gql } from "../__generated__";
import { useQuery } from "@apollo/client";

import TrackCard from "../containers/track-card";

const GET_TRACKS = gql(`
  query GetAuthors {
    getTracks {
        id
        title
        thumbnail
        length
        modulesCount
        author {
            id
            name
            photo
        }
    }
}
  `);

/**
 * Tracks Page is the Catstronauts home page.
 * We display a grid of tracks fetched with useQuery with the TRACKS query
 */
const Tracks = () => {
  const {loading, error, data} = useQuery(GET_TRACKS);
  if(loading) return <p>Loading...</p>;
  if(error) return <p>Error :</p>;


  return <Layout grid>
     {
      data?.getTracks?.map((track) => (
       <TrackCard key={track?.id} track={track} />
      ))
     }
  </Layout>;
};

export default Tracks;