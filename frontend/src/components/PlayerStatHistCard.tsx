import { useEffect, useState } from 'react';
import axios from 'axios';

import { LineChart } from '@mui/x-charts';

type InputProps = {
    player_id: number,
}

type RankHistoryItem = {
    date: Date;
    rank: number;
};

type PPHistoryItem = {
    date: Date;
    pp: number;
};

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

function PlayerStatHistCard(props: InputProps) {
    const [stats, setStats] = useState<PlayerStatsHist[] | null>(null);

    useEffect(() => {
        Promise.all([
            axios.get(`http://127.0.0.1:8000/current/${props.player_id}`),
            axios.get(`http://127.0.0.1:8000/history/${props.player_id}`)
        ])
        .then(([res1, res2]) => {
            setStats(res2.data);
        })
        .catch(error => console.error(error));
    }, [props.player_id]);

    const rankHist: RankHistoryItem[] = [];
    const ppHist: PPHistoryItem[] = [];

    if (stats) {
        stats.forEach((stat) => {
            rankHist.push({date: new Date(stat.date), rank: stat.rank});
            ppHist.push({date: new Date(stat.date), pp: stat.pp});
        });
    }

    console.log(window.innerWidth, window.innerHeight)

    return (
        <div className='comfortaa graphs-card'>
            {stats ? (
                <>
                    <h2>Rank History</h2>
                    <LineChart
                        xAxis={[
                            { 
                                data: rankHist.map((item) => item.date),
                                valueFormatter: (value) => value.toLocaleDateString('en-US', {month: 'short', day: 'numeric'}),
                                label: 'Date',
                                scaleType: 'point',
                                labelStyle: {
                                    fill: "#ffffffde",
                                    fontFamily: "Comfortaa",
                                }
                            }
                        ]}
                        series={[
                            { 
                                data: rankHist.map((item) => item.rank),
                                showMark: false,
                                color: '#9171f8',
                            }
                        ]}
                        yAxis={[
                            {
                                reverse: true,
                            }
                        ]}
                        slotProps={{ 
                            legend: { hidden: true }
                        }}
                        title="Rank History"
                        dataset={rankHist}
                        width={window.innerWidth * 0.55}
                        height={window.innerHeight * 0.3}
                        sx={{ 
                            marginTop: -5,
                            // left
                            "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel":{
                                fill:"#ffffffde"
                            },
                            "& .MuiChartsAxis-left .MuiChartsAxis-line":{
                                stroke: "#ffffffde",
                                strokeWidth: 3,
                            },

                            // bottom
                            "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel":{
                                fill:"#ffffffde"
                            },
                            "& .MuiChartsAxis-bottom .MuiChartsAxis-line":{
                                stroke: "#ffffffde",
                                strokeWidth: 3,
                            },

                            // misc
                            "& .MuiChartsAxis-tickContainer .MuiChartsAxis-tickLabel":{
                                fontFamily: "Comfortaa",
                            },
                            "& .MuiChartsAxis-tickContainer .MuiChartsAxis-tick":{
                                strokeWidth: 0
                            },
                            "& .MuiChartsAxis-tickContainer .MuiChartsAxis-line":{
                                strokeWidth: 3
                            },
                        }}
                    />
                    <h2>PP History</h2>
                    <LineChart
                        xAxis={[
                            { 
                                data: ppHist.map((item) => item.date),
                                valueFormatter: (value) => value.toLocaleDateString('en-US', {month: 'short', day: 'numeric'}),
                                label: 'Date',
                                scaleType: 'point',
                                labelStyle: {
                                    fill: "#ffffffde",
                                    fontFamily: "Comfortaa",
                                }
                            }
                        ]}
                        series={[
                            { 
                                data: ppHist.map((item) => item.pp),
                                label: 'PP',
                                showMark: false,
                                color: '#9171f8'
                            }
                        ]}
                        slotProps={{ 
                            legend: { hidden: true }
                            
                        }}
                        title="PP History"
                        dataset={ppHist}
                        width={window.innerWidth * 0.55}
                        height={window.innerHeight * 0.3}
                        sx={{ 
                            marginTop: -5,
                            // left
                            "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel":{
                                fill:"#ffffffde"
                            },
                            "& .MuiChartsAxis-left .MuiChartsAxis-line":{
                                stroke: "#ffffffde",
                                strokeWidth: 3,
                            },

                            // bottom
                            "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel":{
                                fill:"#ffffffde"
                            },
                            "& .MuiChartsAxis-bottom .MuiChartsAxis-line":{
                                stroke: "#ffffffde",
                                strokeWidth: 3,
                            },

                            // misc
                            "& .MuiChartsAxis-tickContainer .MuiChartsAxis-tickLabel":{
                                fontFamily: "Comfortaa",
                            },
                            "& .MuiChartsAxis-tickContainer .MuiChartsAxis-tick":{
                                strokeWidth: 0
                            },
                            "& .MuiChartsAxis-tickContainer .MuiChartsAxis-line":{
                                strokeWidth: 3
                            },
                        }}
                    />
                </>
                
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}

export default PlayerStatHistCard;