import { useState, useEffect } from 'react';
import axios from 'axios';

import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

import TwitterLogo from '../assets/twitter.svg';
import DiscordLogo from '../assets/discord.svg';

type InputProps = {
    player_id: number,
}

interface PlayerStats {
    username: string;
    pfp: string;
    country: string;
    joined: string;
    rank: number;
    pp: number;
    playcount: number;
    level: number;
    playstyle: number;
    location: string;
    occupation: string;
    interests: string;
    twitter: string;
    discord: string;
}

interface PlayerStatsHist {
    player_id: number;
    date: Date;
    rank: number;
    pp: number;
    playcount: number;
    ssh_count: number;
    ss_count: number;
    sh_count: number;
    s_count: number;
}

interface WindowSize {
    width: number;
    height: number;
}

function decodePlaystyle(playstyle: number) {
    let result = [];
    if (playstyle & 1) result.push('Mouse');
    if (playstyle & 2) result.push('Keyboard');
    if (playstyle & 4) result.push('Tablet');
    if (playstyle & 8) result.push('Touch');
    return result.join(', ');
}

function PlayerInfoCard(props: InputProps) {
    const [stats, setStats] = useState<PlayerStats | null>(null);
    const [statsHist, setStatsHist] = useState<PlayerStatsHist[] | null>(null);
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    
      useEffect(() => {
        const handleResize = () => {
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        };
    
        window.addEventListener('resize', handleResize);
    
        // Cleanup function to remove the event listener
        return () => window.removeEventListener('resize', handleResize);
      }, []);
    
    useEffect(() => {
        Promise.all([
            axios.get(`http://127.0.0.1:8000/${props.player_id}`),
            axios.get(`http://127.0.0.1:8000/current/${props.player_id}`),
            axios.get(`http://127.0.0.1:8000/history/${props.player_id}`)
        ])
        .then(([res1, , res3]) => {
            setStats(res1.data);
            setStatsHist(res3.data);
        })
        .catch(error => console.error(error));
    }, [props.player_id]);

    return (
        <div className='comfortaa'>
            {(stats && statsHist) ? (
                <div className='player-info'>
                    <div className='info-card'>
                        <div className='main-info-card'>
                            <Avatar
                                component='div'
                                alt="User Pfp"
                                src={stats.pfp}
                                variant='rounded'
                                sx={{ width: 80, height: 80 }}
                                draggable='false'
                            />
                            <div>
                                <div style={{paddingBottom: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <img 
                                        src={`https://osu.ppy.sh/images/flags/${stats.country}.png`}
                                        style={{width: '50px', height: 'auto'}}
                                        draggable='false'
                                    />
                                    <h2 className='username'>{stats.username}</h2>
                                </div>
                                <p>Global Rank: #{stats.rank.toLocaleString()}</p>
                            </div>
                        </div>
                        <Divider orientation='horizontal' className='info-divider' style={{  }} />
                        <div className='sub-info-card'>
                            <div>
                                <h3>pp</h3>
                                <p>{stats.pp}</p>
                            </div>
                            <div>
                                <h3>playcount</h3>
                                <p>{stats.playcount}</p>
                            </div>
                            <div>
                                <h3>level</h3>
                                <p>{stats.level}</p>
                            </div>
                        </div>
                    </div>

                    <div className='grade-info-card'>
                        <div>
                            <img 
                                src='https://osu.ppy.sh/assets/images/GradeSmall-SS-Silver.6681366c.svg'
                                draggable='false'
                            />
                            <h3>{statsHist[statsHist.length - 1].ssh_count}</h3>
                        </div>
                        <div>
                            <img 
                                src='https://osu.ppy.sh/assets/images/GradeSmall-SS.a21de890.svg'
                                draggable='false'
                            />
                            <h3>{statsHist[statsHist.length - 1].ss_count}</h3>
                        </div>
                        <div>
                            <img 
                                src='https://osu.ppy.sh/assets/images/GradeSmall-S-Silver.811ae28c.svg'
                                draggable='false'
                            />
                            <h3>{statsHist[statsHist.length - 1].sh_count}</h3>
                        </div>
                        <div>
                            <img 
                                src='https://osu.ppy.sh/assets/images/GradeSmall-S.3b4498a9.svg'
                                draggable='false'
                            />
                            <h3>{statsHist[statsHist.length - 1].s_count}</h3>
                        </div>          
                    </div>

                    <div className='bottom-card'>
                        <div className='additional-info-card'>
                            <div>
                                <LocationOnIcon fontSize='small' />
                                <p>{stats.location}</p>
                            </div>
                            <div>
                                <WorkIcon fontSize='small' />
                                <p>{stats.occupation}</p>
                            </div>
                            <div>
                                <FavoriteIcon fontSize='small' />
                                <p>{stats.interests}</p>
                            </div>
                            <div>
                                <SportsEsportsIcon fontSize='small' />
                                <p>{decodePlaystyle(stats.playstyle)}</p>
                            </div>
                        </div>

                        { stats.twitter && stats.discord ? (
                            <div className='social-media'>
                                <div>
                                    <img src={TwitterLogo} width={25} />
                                    <a target='_blank' href={`https://twitter.com/${stats.twitter}`}>{stats.twitter}</a>
                                </div>
                                &#183;
                                <div>
                                    <img src={DiscordLogo} width={25} />
                                    <p onClick={() => navigator.clipboard.writeText(stats.discord)}>{stats.discord}</p>
                                </div>
                            </div>
                            ) : (
                                <></>
                            )
                        }
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )
        }
        </div>
    );
}

export default PlayerInfoCard;