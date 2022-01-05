import addImport from "./addImport";

describe("addImport", () => {
  test("adds a new import when no gestalt import is found", async () => {
    expect(
      await addImport({
        code: "",
        componentName: "CallOut",
      })
    ).toEqual(`import { CallOut } from 'gestalt';`);
  });

  test("adds an import when gestalt import is found", async () => {
    expect(
      await addImport({
        code: "import { Box } from 'gestalt';",
        componentName: "CallOut",
      })
    ).toEqual(`import { Box, CallOut } from 'gestalt';`);
  });

  test("adds an import when gestalt import is found", async () => {
    expect(
      await addImport({
        code: "import { CallOut } from 'gestalt';",
        componentName: "Box",
      })
    ).toEqual(`import { Box, CallOut } from 'gestalt';`);
  });

  test("does not add import it already exists", async () => {
    expect(
      await addImport({
        code: "import { Box } from 'gestalt';",
        componentName: "Box",
      })
    ).toEqual(`import { Box } from 'gestalt';`);
  });

  test("works with other imports", async () => {
    expect(
      await addImport({
        code: `
        // @flow
        import { Avatar, AvatarGroup, CallOut } from 'gestalt';
        import AuthDesktopIdeaPage from 'app/www/pages/IdeaRootPage';
        import Document from 'node/sites/www/routes/_document';
        import type LegacyContext from 'node/lib/LegacyContext';
      `.trim(),
        componentName: "Avatar",
      })
    ).toMatchInlineSnapshot(`
      "// @flow
      import { Avatar, AvatarGroup, CallOut } from 'gestalt';
      import AuthDesktopIdeaPage from 'app/www/pages/IdeaRootPage';
      import Document from 'node/sites/www/routes/_document';
      import type LegacyContext from 'node/lib/LegacyContext';"
    `);
  });

  test("works with other imports - long", async () => {
    expect(
      await addImport({
        code: `
      // @flow
      import { createRef, Component, memo, type ElementRef, type Node } from 'react';
      import { useDispatch, useSelector } from 'react-redux';
      import BoardSelectionDisplay from 'app/common/react/components/common/PinBetterSave/BoardSelectionDisplay';
      import EmailVerificationReminderModal from 'app/common/react/components/EmailVerificationReminderModal/EmailVerificationReminderModal';
      import ErrorBoundary from 'app/packages/error-boundary';
      import errorUtil from 'app/common/lib/errorUtil';
      import getClientTrackingParams from 'app/packages/client-tracking-params';
      import itemsAdded from 'app/common/redux/actions/feeds/itemsAdded';
      import Link from 'app/common/react/ui/Link';
      import multilineEllipsis from 'app/packages/strings/multilineEllipsis';
      import PinSaveRequestRepinWithSectionSuggestions from 'app/common/react/components/save/pin-to-board/PinToBoard/PinSaveRequestRepinWithSectionSuggestions';
      import PostSavedPinToast from 'app/common/react/components/common/PinBetterSave/PostSavedPinToast';
      import ResourceFactory from 'app/common/lib/ResourceFactory';
      import SavedStatus from 'app/common/react/components/common/PinBetterSave/SavedStatus';
      import Toast from 'app/packages/gestaltExtensions/Toast';
      import useSaveToProfile from 'app/common/react/components/profile/ProfileBoards/BoardlessPins/useSaveToProfile';
      import useViewer from 'app/packages/useViewer';
      import { BoardFlyoutWithShortlist } from 'app/common/react/components/common/PinBetterSave/BoardFlyout';
      import { boardPinCountChanged } from 'app/common/redux/actions/board/update';
      import { FEED_TYPE } from 'app/common/redux/reducers/feeds';
      import { getQueryFromMostRecentSearch } from 'app/common/react/components/closeup/PathHelpers';
      import { instance as pubSub } from 'app/common/lib/DeprecatedPubSub'; // eslint-disable-line pinterest/no-deprecated-imports
      import { REQUIRE_EMAIL_VERIFICATION } from 'app/packages/pinterest-authentication/apiCodes';
      import { searchQueryInvalidated } from 'app/common/redux/actions/createBoardUpsell';
      import { setMostRecentBoard } from 'app/common/redux/actions/mostRecentBoard';
      import { showRepinAnimation } from 'app/common/redux/actions/header';
      import { track } from 'app/common/lib/react/analytics';
      import { type Board } from 'app/packages/pinterest-flow-types/board';
      import { type ButtonEventHandler } from 'app/packages/gestaltExtensions/flowtypes';
      import { type Entry } from 'app/common/redux/reducers/location';
      import { type HistoryEntry } from 'app/common/redux/reducers/history';
      import { type PinCarouselData } from 'app/packages/generated-types/api';
      import { type RepinResourceOptions } from 'app/packages/pinterest-flow-types/resources/repin';
      import { type SaveTarget } from 'app/packages/pinterest-flow-types/saveTarget';
      import { type SensitiveContentNoticeType } from 'app/packages/pinterest-flow-types/contentSensitivity';
      import { type State as BoardType } from 'app/common/redux/reducers/board';
      import { type State as PinType } from 'app/common/redux/reducers/pin';
      import { type State as PostRepinMoreIdeasUpsell } from 'app/common/redux/reducers/ui/postRepinMoreIdeasUpsell';
      import { type State as ReduxState } from 'app/common/redux/reducers/types';
      import { type Variants } from 'app/common/react/components/common/PinBetterSave/types';
      import { updateUserPinCount } from 'app/common/redux/actions/user/update';
      import PinToBoard, {
        type CreatePinPromise,
      } from 'app/common/react/components/save/pin-to-board/PinToBoard/PinToBoard';
      import PostRepinUpsellToast, {
        shouldShowPostRepinUpsellToast,
      } from 'app/common/react/components/common/PinBetterSave/PostRepinUpsellToast';
      import useI18n, { type I18nContext } from 'app/packages/i18n/useI18n';
      import useRequireAuth, {
        type RequireAuth,
      } from 'app/common/react/components/limitedLogin/useRequireAuth';
      import useResource, { type Resource } from 'app/common/lib/react/useResource';
      import {
        hasSensitivityNotices,
        isBoardSensitive,
      } from 'app/common/react/components/ContentSensitivity/common';
      import {
        save,
        unsave,
        selectBoardOrSection,
        type BetterSavePayload,
        type UnsavePayload,
      } from 'app/common/redux/actions/pin/betterSave';
      import {
        useBoardPickerStopwatch,
        setBoardPickerSource,
        type Stopwatch,
      } from 'app/packages/pwt-logger/stopwatch/boardPickerStopwatch';
      import {
        useToastManagerContext,
        type ToastManagerContextType,
      } from 'app/common/react/ui/ToastManagerContext';
      import { ActivationCard, Box, Layer, Popover, Text } from 'gestalt';
      import { getStringifiedCommerceAuxData, isSTLPin } from 'app/common/lib/CommerceUtil';
      import { useHistory, useLocation, type RouterHistory, type Location } from 'react-router-dom';
`.trim(),
        componentName: "Avatar",
      })
    ).toMatchInlineSnapshot(`
      "// @flow
      import { createRef, Component, memo, type ElementRef, type Node } from 'react';
      import { useDispatch, useSelector } from 'react-redux';
      import BoardSelectionDisplay from 'app/common/react/components/common/PinBetterSave/BoardSelectionDisplay';
      import EmailVerificationReminderModal from 'app/common/react/components/EmailVerificationReminderModal/EmailVerificationReminderModal';
      import ErrorBoundary from 'app/packages/error-boundary';
      import errorUtil from 'app/common/lib/errorUtil';
      import getClientTrackingParams from 'app/packages/client-tracking-params';
      import itemsAdded from 'app/common/redux/actions/feeds/itemsAdded';
      import Link from 'app/common/react/ui/Link';
      import multilineEllipsis from 'app/packages/strings/multilineEllipsis';
      import PinSaveRequestRepinWithSectionSuggestions from 'app/common/react/components/save/pin-to-board/PinToBoard/PinSaveRequestRepinWithSectionSuggestions';
      import PostSavedPinToast from 'app/common/react/components/common/PinBetterSave/PostSavedPinToast';
      import ResourceFactory from 'app/common/lib/ResourceFactory';
      import SavedStatus from 'app/common/react/components/common/PinBetterSave/SavedStatus';
      import Toast from 'app/packages/gestaltExtensions/Toast';
      import useSaveToProfile from 'app/common/react/components/profile/ProfileBoards/BoardlessPins/useSaveToProfile';
      import useViewer from 'app/packages/useViewer';
      import { BoardFlyoutWithShortlist } from 'app/common/react/components/common/PinBetterSave/BoardFlyout';
      import { boardPinCountChanged } from 'app/common/redux/actions/board/update';
      import { FEED_TYPE } from 'app/common/redux/reducers/feeds';
      import { getQueryFromMostRecentSearch } from 'app/common/react/components/closeup/PathHelpers';
      import { instance as pubSub } from 'app/common/lib/DeprecatedPubSub'; // eslint-disable-line pinterest/no-deprecated-imports
      import { REQUIRE_EMAIL_VERIFICATION } from 'app/packages/pinterest-authentication/apiCodes';
      import { searchQueryInvalidated } from 'app/common/redux/actions/createBoardUpsell';
      import { setMostRecentBoard } from 'app/common/redux/actions/mostRecentBoard';
      import { showRepinAnimation } from 'app/common/redux/actions/header';
      import { track } from 'app/common/lib/react/analytics';
      import { type Board } from 'app/packages/pinterest-flow-types/board';
      import { type ButtonEventHandler } from 'app/packages/gestaltExtensions/flowtypes';
      import { type Entry } from 'app/common/redux/reducers/location';
      import { type HistoryEntry } from 'app/common/redux/reducers/history';
      import { type PinCarouselData } from 'app/packages/generated-types/api';
      import { type RepinResourceOptions } from 'app/packages/pinterest-flow-types/resources/repin';
      import { type SaveTarget } from 'app/packages/pinterest-flow-types/saveTarget';
      import { type SensitiveContentNoticeType } from 'app/packages/pinterest-flow-types/contentSensitivity';
      import { type State as BoardType } from 'app/common/redux/reducers/board';
      import { type State as PinType } from 'app/common/redux/reducers/pin';
      import { type State as PostRepinMoreIdeasUpsell } from 'app/common/redux/reducers/ui/postRepinMoreIdeasUpsell';
      import { type State as ReduxState } from 'app/common/redux/reducers/types';
      import { type Variants } from 'app/common/react/components/common/PinBetterSave/types';
      import { updateUserPinCount } from 'app/common/redux/actions/user/update';
      import PinToBoard, {
      type CreatePinPromise } from
      'app/common/react/components/save/pin-to-board/PinToBoard/PinToBoard';
      import PostRepinUpsellToast, {
      shouldShowPostRepinUpsellToast } from
      'app/common/react/components/common/PinBetterSave/PostRepinUpsellToast';
      import useI18n, { type I18nContext } from 'app/packages/i18n/useI18n';
      import useRequireAuth, {
      type RequireAuth } from
      'app/common/react/components/limitedLogin/useRequireAuth';
      import useResource, { type Resource } from 'app/common/lib/react/useResource';
      import {
      hasSensitivityNotices,
      isBoardSensitive } from
      'app/common/react/components/ContentSensitivity/common';
      import {
      save,
      unsave,
      selectBoardOrSection,
      type BetterSavePayload,
      type UnsavePayload } from
      'app/common/redux/actions/pin/betterSave';
      import {
      useBoardPickerStopwatch,
      setBoardPickerSource,
      type Stopwatch } from
      'app/packages/pwt-logger/stopwatch/boardPickerStopwatch';
      import {
      useToastManagerContext,
      type ToastManagerContextType } from
      'app/common/react/ui/ToastManagerContext';
      import { ActivationCard, Avatar, Box, Layer, Popover, Text } from 'gestalt';
      import { getStringifiedCommerceAuxData, isSTLPin } from 'app/common/lib/CommerceUtil';
      import { useHistory, useLocation, type RouterHistory, type Location } from 'react-router-dom';"
    `);
  });
});
