import {Plugin} from "oitq";
import {default as axios} from 'axios'
import querystring from "querystring";
type MusicPlatform='163'|'qq'
const m_ERR_CODE = Object.freeze({
    ERR_SRC: "1",
    ERR_404: "2",
    ERR_API: "3",
});

type MusicInfo = {
    type: MusicPlatform,
    id: string
}
const m_ERR_MSG = Object.freeze({
    [m_ERR_CODE.ERR_SRC]: "错误的音乐源",
    [m_ERR_CODE.ERR_404]: "没有查询到对应歌曲",
    [m_ERR_CODE.ERR_API]: "歌曲查询出错",
});
async function musicQQ(keyword) {
    const url = "https://c.y.qq.com/soso/fcgi-bin/client_search_cp";
    const query = {w: keyword};
    const headers = {
        "Content-Type": "application/x-javascript;charset=utf-8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
    };
    let jbody;
    try {
        jbody = await axios.get(`${url}?${new URLSearchParams(query)}`, {headers});
    } catch (e) {
        return m_ERR_CODE.ERR_API;
    }

    if (!jbody) {
        return m_ERR_CODE.ERR_API;
    }

    try {
        // callback({"code":0,"data":{})
        const starti = "callback(".length;
        jbody = JSON.parse(jbody.substring(starti, jbody.length - 1));
    } catch (e) {
        return m_ERR_CODE.ERR_API;
    }

    if (jbody.data.data?.song?.list[0]?.songid) {
        return {type: "qq" as MusicPlatform, id: jbody.data.data.song.list[0].songid};
    }

    return m_ERR_CODE.ERR_404;
}

async function music163(keyword) {
    const url = "https://music.163.com/api/search/get/";
    const form = {
        s: keyword,
        // 1:单曲、 10:专辑、 100:歌手、 1000:歌单、 1002:用户、 1004:MV、 1006:歌词、 1009:电台、 1014:视频
        type: 1,
        limit: 1,
        offset: 0,
    };
    const body = querystring.stringify(form);
    const headers = {
        "Content-Length": String(body.length),
        "Content-Type": "application/x-www-form-urlencoded",
        Referer: "https://music.163.com",
        Cookie: "appver=2.0.2",
    };
    let jbody;
    try {
        jbody = await axios.post(url, body, {headers});
    } catch (e) {
        return m_ERR_CODE.ERR_API;
    }
    if (!jbody) {
        return m_ERR_CODE.ERR_API;
    }

    if (jbody.data.result?.songs[0]?.id) {
        return {type: "163" as MusicPlatform, id: jbody.data.result.songs[0].id};
    }

    return m_ERR_CODE.ERR_404;
}
const musicPlugin = new Plugin('music',__filename)
musicPlugin.command('music [keyword:string]','all')
    .desc('音乐搜索')
    .shortcut('点歌', {fuzzy: true})
    .shortcut(/^来一首(\S+)$/, {args: ['$1']})
    .option('platform', '-p <platform:string> 音乐平台', {initial: '163'})
    .action(async ({options,session},keyword)=>{
    if (!keyword) return
        let musicInfo: string | MusicInfo
        switch (options.platform) {
            case '163':
                musicInfo = await music163(keyword)
                break;
            case 'qq':
                musicInfo = await musicQQ(keyword)
                break;
            default:
                musicInfo = m_ERR_CODE.ERR_SRC
                break;
        }

        if (typeof musicInfo === 'string') {
            return m_ERR_MSG[musicInfo]
        }
        switch (session.message_type) {
            case 'private':
                await session.bot.pickFriend(session.sender.user_id).shareMusic(musicInfo.type, musicInfo.id)
                break;
            case 'group':
                await session.bot.pickGroup(session.group_id).shareMusic(musicInfo.type, musicInfo.id)
                break;
            default:
                break;
        }
        return true
})