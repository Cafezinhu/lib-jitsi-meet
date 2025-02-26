import { getLogger } from '@jitsi/logger';
import $ from 'jquery';
import { Strophe } from 'strophe.js';

import { XMPPEvents } from '../../service/xmpp/XMPPEvents';

import ChatRoom from './ChatRoom';
import { ConnectionPluginListenable } from './ConnectionPlugin';

const logger = getLogger("");

/**
 * MUC connection plugin.
 */
export default class MucConnectionPlugin extends ConnectionPluginListenable {
    /**
     *
     * @param xmpp
     */
    constructor(xmpp) {
        super();
        this.xmpp = xmpp;
        this.rooms = {};
    }

    /**
     *
     * @param connection
     */
    init(connection) {
        super.init(connection);

        // add handlers (just once)
        this.connection.addHandler(this.onPresence.bind(this), null,
            'presence', null, null, null, null);
        this.connection.addHandler(this.onPresenceUnavailable.bind(this),
            null, 'presence', 'unavailable', null);
        this.connection.addHandler(this.onPresenceError.bind(this), null,
            'presence', 'error', null);
        this.connection.addHandler(this.onMessage.bind(this), null,
            'message', null, null);
        this.connection.addHandler(this.onMute.bind(this),
            'http://jitsi.org/jitmeet/audio', 'iq', 'set', null, null);
        this.connection.addHandler(this.onMuteVideo.bind(this),
            'http://jitsi.org/jitmeet/video', 'iq', 'set', null, null);
    }

    /**
     *
     * @param jid
     * @param password
     * @param options
     */
    createRoom(jid, password, options) {
        const roomJid = Strophe.getBareJidFromJid(jid);

        if (this.isRoomCreated(roomJid)) {
            const errmsg = 'You are already in the room!';

            logger.error(errmsg);
            throw new Error(errmsg);
        }
        this.rooms[roomJid] = new ChatRoom(this.connection, jid,
            password, this.xmpp, options);
        this.eventEmitter.emit(
            XMPPEvents.EMUC_ROOM_ADDED, this.rooms[roomJid]);

        return this.rooms[roomJid];
    }

    /**
     *  Check if a room with the passed JID is already created.
     *
     * @param {string} roomJid - The JID of the room.
     * @returns {boolean}
     */
    isRoomCreated(roomJid) {
        return roomJid in this.rooms;
    }

    /**
     *
     * @param jid
     */
    doLeave(jid) {
        this.eventEmitter.emit(
            XMPPEvents.EMUC_ROOM_REMOVED, this.rooms[jid]);
        delete this.rooms[jid];
    }

    /**
     *
     * @param pres
     */
    onPresence(pres) {
        const from = pres.getAttribute('from');

        // What is this for? A workaround for something?
        if (pres.getAttribute('type')) {
            return true;
        }

        const room = this.rooms[Strophe.getBareJidFromJid(from)];

        if (!room) {
            return true;
        }

        // Parse status.
        if ($(pres).find('>x[xmlns="http://jabber.org/protocol/muc#user"]'
            + '>status[code="201"]').length) {
            room.createNonAnonymousRoom();
        }

        room.onPresence(pres);

        return true;
    }

    /**
     *
     * @param pres
     */
    onPresenceUnavailable(pres) {
        const from = pres.getAttribute('from');
        const room = this.rooms[Strophe.getBareJidFromJid(from)];

        if (!room) {
            return true;
        }

        room.onPresenceUnavailable(pres, from);

        return true;
    }

    /**
     *
     * @param pres
     */
    onPresenceError(pres) {
        const from = pres.getAttribute('from');
        const room = this.rooms[Strophe.getBareJidFromJid(from)];

        if (!room) {
            return true;
        }

        room.onPresenceError(pres, from);

        return true;
    }

    /**
     *
     * @param msg
     */
    onMessage(msg) {
        // FIXME: this is a hack. but jingle on muc makes nickchanges hard
        const from = msg.getAttribute('from');
        const room = this.rooms[Strophe.getBareJidFromJid(from)];

        if (!room) {
            return true;
        }

        room.onMessage(msg, from);

        return true;
    }

    /**
     * TODO: Document
     * @param iq
     */
    onMute(iq) {
        const from = iq.getAttribute('from');
        const room = this.rooms[Strophe.getBareJidFromJid(from)];

        // Returning false would result in the listener being deregistered by Strophe
        if (!room) {
            return true;
        }

        room.onMute(iq);

        return true;
    }

    /**
     * TODO: Document
     * @param iq
     */
    onMuteVideo(iq) {
        const from = iq.getAttribute('from');
        const room = this.rooms[Strophe.getBareJidFromJid(from)];

        // Returning false would result in the listener being deregistered by Strophe
        if (!room) {
            return true;
        }

        room.onMuteVideo(iq);

        return true;
    }
}
