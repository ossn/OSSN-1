/* eslint-disable no-console */
import "../../components/pages-styles/members.scss";

import React from "react";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import Img from "gatsby-image";
import MediaQuery from "react-responsive";
import BasicLayout from "../../components/layouts/layout-base/layout-base";
import LayoutContained from "../../components/layouts/layout-contained/layout-contained";
import Layout2ColUnequalWith3Elements from "../../components/layouts/layout-2col-unequal-with-3-elements/layout-2col-unequal-with-3-elements";
import ShadowBox from "../../components/components/shadow-box/shadow-box";
import Shape from "../../components/components/shape/shape";
import { Query, ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";
import { PlusSquare } from "react-feather";

import { SearchFilter } from "../../components/components/filter/filter";
import JoinCta from "../../components/components/join-cta/join-cta";
import MemberList from "../../components/components/member-list/member-list";
import GatsbyConfig from "../../../gatsby-config";

/**
 * This page shows the list of the student members.
 */

/**
 * The member query.
 */
const NUMBER_OF_USERS_TO_FETCH = 10;
const GET_MEMBERS = gql`
  query GetMembers($number: Int!, $cursor: ID, $search: String) {
    users(first: $number, after: $cursor, search: $search) {
      users {
        id
        userName
        name
        imageUrl
        receiveNewsletter
        description
        githubUrl
        personalUrl
        email
        clubs {
          name
          role
        }
      }

      pageInfo {
        totalCount
        endCursor
        hasNextPage
        startCursor
      }
    }
  }
`;

// TODO: Refactor this component to leverage only the <Query> component
// from the apollo library (along with the refetch and fetchMore
// properties of the Query component in order to cover load more and search
// functionality)
class Members extends React.PureComponent {
  state = {
    search: null,
    shownMembersCount: 0,
    shownMembers: [],
    cursor: null,
    firstLoad: true,
    hasNextPage: false,
    totalCount: 0
  };

  timer = 0;

  /**
   * Handles search and updates member state.
   */
  handleSearch = event => {
    const target = event.target;
    const value = target.value;

    clearInterval(this.timer);

    this.timer = window.setTimeout(() => {
      this.setState({
        search: value,
        firstLoad: true,
        shownMembers: [],
        cursor: null,
        shownMembersCount: 0,
        hasNextPage: false,
        totalCount: 0
      });
    }, 300);
  };

  /**
   * Updates the number of members that are being shown. Triggers re-render.
   *
   * @params {Object} data
   */
  onMembersFetched = data => {
    this.setState(state => {
      const shownMembers = state.shownMembers.concat(data.users.users);
      shownMembers.sort(this.sortMembers);
      return {
        shownMembersCount: shownMembers.length,
        shownMembers: shownMembers,
        cursor: data.users.pageInfo.endCursor,
        firstLoad: false,
        hasNextPage: data.users.pageInfo.hasNextPage,
        totalCount: data.users.pageInfo.totalCount
      };
    });
  };
  /**
   * Sort the member so that leader should be on top
   */
  sortMembers = (a, b) => {
    const isALeader = this.checkForLeader(a);
    const isBLeader = this.checkForLeader(b);
    if (isALeader === isBLeader) {
      return 0;
    } else if (isALeader < isBLeader) {
      return 1;
    } else {
      return -1;
    }
  };
  /**
   * Check the member for being a leader or not
   */
  checkForLeader = member => {
    return member.clubs
      ? member.clubs.length > 0 &&
          member.clubs.some(club => {
            return club.role === "admin" || club.role === "club_owner";
          })
      : member.role &&
          (member.role === "admin" || member.role === "club_owner");
  };
  /**
   * Fetches default results on first load.
   */
  onFirstLoad = () => {
    let content;
    if (this.state.firstLoad) {
      content = (
        <Query
          query={GET_MEMBERS}
          variables={{
            number: NUMBER_OF_USERS_TO_FETCH,
            cursor: this.state.cursor,
            search: this.state.search
          }}
          onCompleted={data => {
            this.onMembersFetched(data);
          }}
        >
          {({ loading, error }) => {
            if (loading)
              return (
                <div className="text text--large text--load-more">
                  Loading....
                </div>
              );
            if (error) {
              return <div> `Error ${error.message}` </div>;
            } else {
              // JSX elements
              // create the DOM for the component.
              return null;
            }
          }}
        </Query>
      );
      return content;
    }
  };

  render() {
    const snapshot = this.state;

    return (
      <BasicLayout location={this.props.location}>
        <Helmet>
          <title>{`Members | ${GatsbyConfig.siteMetadata.title}`}</title>
        </Helmet>

        <LayoutContained>
          <h1> Members </h1>
          <Layout2ColUnequalWith3Elements horizontalGutters verticalGutters>
            <div className="members__intro">
              <p>
                Connect with the amazing students of our network. Explore their
                clubs, their interests and their creations. If you want to
                connect with any of the club or individuals, reach out through
                out our communication channels at our opportunities page.
              </p>
            </div>
            <div>
              <MediaQuery minWidth={992}>
                <div className="members__image">
                  <Img
                    fluid={
                      this.props.data.imageMembersTop.childImageSharp.fluid
                    }
                  />
                  <Shape sunnyYellow triangle2 className="members__triangle" />
                </div>
              </MediaQuery>

              <div>
                <JoinCta imageJoinCta={this.props.data.imageJoinCta} />
              </div>
            </div>
            <div className="members__content">
              <Shape
                seafoamBlue
                waveLarge
                divider
                className="members__divider"
              />

              <div>
                <ShadowBox zeroPadding className="members__filters-section">
                  <h2 className="title title--x-small title--centered members__list-title">
                    Showing {snapshot.shownMembersCount} out of{" "}
                    {snapshot.totalCount} members
                  </h2>
                  <div className="members__filter-list">
                    <div className="members__filter members__filter--search">
                      <SearchFilter
                        id="members-search"
                        label="Search members"
                        onChange={this.handleSearch}
                      />
                    </div>
                  </div>
                </ShadowBox>
                {this.onFirstLoad()}
                <MemberList members={snapshot.shownMembers} />

                <ApolloConsumer>
                  {client => (
                    <div className="members__button-wrapper">
                      <button
                        className="button button--reset button--icon"
                        onClick={async () => {
                          const { data } = await client.query({
                            query: GET_MEMBERS,
                            variables: {
                              number: NUMBER_OF_USERS_TO_FETCH,
                              cursor: snapshot.cursor,
                              search: snapshot.search
                            }
                          });
                          this.onMembersFetched(data);
                        }}
                        hidden={!snapshot.hasNextPage}
                      >
                        <PlusSquare size={16} />
                        Load more
                      </button>
                    </div>
                  )}
                </ApolloConsumer>
              </div>
            </div>
          </Layout2ColUnequalWith3Elements>
        </LayoutContained>
      </BasicLayout>
    );
  }
}

export default Members;

export const query = graphql`
  {
    imageMembersTop: file(relativePath: { eq: "members-top.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 728) {
          base64
          aspectRatio
          src
          srcSet
          srcWebp
          srcSetWebp
          sizes
          originalImg
          originalName
        }
      }
    }

    imageJoinCta: file(relativePath: { eq: "join-cta/join-the-network.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 728) {
          base64
          aspectRatio
          src
          srcSet
          srcWebp
          srcSetWebp
          sizes
          originalImg
          originalName
        }
      }
    }
  }
`;
