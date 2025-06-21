import { GameLayout } from '@/components/GameLayout';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { GuardianService, type GameReviewData } from '@/api/generated';
import ReactMarkdown from 'react-markdown';

// tech debt: clean up, rushed code, use zustand, use tanstack query, and more tabs to own components
export const Route = createFileRoute('/profile')({
  component: RouteComponent,
})

enum MenuItems {
    LearningFocus = 1,
    LearningProgress = 2,
    ChangePassword = 3,
    AIGameReport = 4,
    AIMetaAnalysis = 5,
}

const menuItems = [
    {
        id: MenuItems.LearningFocus,
        text: 'Learning Focus',
    },
    {
        id: MenuItems.LearningProgress,
        text: 'Learning Progress',
    },
    {
        id: MenuItems.ChangePassword,
        text: 'Change Password',
    },
    {
        id: MenuItems.AIGameReport,
        text: 'AI game report',
    },
    {
        id: MenuItems.AIMetaAnalysis,
        text: 'AI meta analysis',
    }
]

function RouteComponent() {
    const [selectedItem, setSelectedItem] = useState(MenuItems.LearningFocus);
    const [gameReport, setGameReport] = useState<GameReviewData[]>([]);
    const [reportViewIndex, setReportViewIndex] = useState(0);
    const [metaAnalysis, setMetaAnalysis] = useState<string>("");
    const [generatingMetaAnalysis, setGeneratingMetaAnalysis] = useState(false);

    useEffect(() => {
        const fetchGameReport = async () => {
            const response = await GuardianService.getGamesReviewGuardianGamesReviewGet();
            setGameReport(response);
        }
        fetchGameReport();
    }, []);

    const generateMetaAnalysis = async () => {
        setGeneratingMetaAnalysis(true);
        try {
            const response = await GuardianService.generateMetaAnalysisGuardianGamesReviewMetaAnalysisPost();
            setMetaAnalysis(response);
        } catch (error) {
            console.error(error);
            setMetaAnalysis("Error generating meta analysis");
        } finally {
            setSelectedItem(MenuItems.AIMetaAnalysis);
            setGeneratingMetaAnalysis(false);
        }
    }

  return <div>
    <GameLayout 
        showHelpButton={false}
        showTimer={false}
    >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] flex gap-4">
            <div className="h-full w-1/4 flex flex-col justify-evenly">
                {menuItems.map(item => (
                    <Button
                        key={item.id}
                        variant="ghost"
                        className={` text-xl w-full justify-start ${selectedItem === item.id ? "" : "text-black/50"} `}
                        onClick={() => setSelectedItem(item.id)}
                    >
                        {item.text}
                    </Button>
                ))}
            </div>

            <div className="h-full w-3/4 flex flex-col justify-top items-center">
                <div className="text-2xl font-bold text-black pb-5">Guardian View</div>
                <Tabs value={selectedItem.toString()}>
                    <TabsContent value={MenuItems.LearningFocus.toString()}>
                        <div>TODO</div>
                    </TabsContent>

                    <TabsContent value={MenuItems.LearningProgress.toString()}>
                        <div>TODO</div>
                    </TabsContent>

                    <TabsContent value={MenuItems.ChangePassword.toString()}>
                        <div>TODO</div>
                    </TabsContent>

                    <TabsContent value={MenuItems.AIGameReport.toString()}>
                        {
                            gameReport.length ?
                            <>
                                <div>
                                    {`Game: ${gameReport[reportViewIndex].game_name} Date: ${new Date(gameReport[reportViewIndex].game_date).toLocaleDateString()} Time: ${gameReport[reportViewIndex]?.total_time || "N/A"}`}
                                </div>
                                <ScrollArea className="rounded-lg bg-white border-4 border-purple-500 w-[500px] h-[500px] p-4">
                                    <ReactMarkdown>{gameReport[reportViewIndex].game_summary}</ReactMarkdown>
                                    <ScrollBar orientation="horizontal" className="bg-purple-500 border"/>
                                </ScrollArea>
                                <div className="flex justify-center pt-4 gap-4 ">
                                    <Button 
                                        className="w-1/3 border-2 border-purple-500"
                                        variant="ghost"
                                        onClick={() => setReportViewIndex(reportViewIndex - 1)} 
                                        disabled={reportViewIndex === 0}
                                    >Previous</Button>
                                    <Button 
                                        className="w-1/3 border-2 border-purple-500"
                                        variant="ghost"
                                        onClick={() => setReportViewIndex(reportViewIndex + 1)} 
                                        disabled={reportViewIndex === gameReport.length - 1}
                                    >Next</Button>

                                    <Button 
                                        className="w-1/3 border-2 border-purple-500"
                                        variant="ghost" 
                                        onClick={generateMetaAnalysis}
                                        disabled={generatingMetaAnalysis}
                                    >{generatingMetaAnalysis ? "Generating..." : "Generate Summary"}</Button>
                                </div>
                                
                            </>
                            :
                            <div>No game report</div>
                        }
                    </TabsContent>

                    <TabsContent value={MenuItems.AIMetaAnalysis.toString()}>
                        {metaAnalysis ?
                            <ScrollArea className="rounded-lg bg-white border-4 border-purple-500 w-[500px] h-[500px] p-4">
                                <ReactMarkdown>{metaAnalysis}</ReactMarkdown>
                                <ScrollBar orientation="horizontal" className="bg-purple-500 border"/>
                            </ScrollArea>
                        :
                            <div className="flex flex-col items-center justify-center h-full gap-4">
                                No meta analysis
                                <Button 
                                    className="w-[200px] border-2 border-purple-500"
                                    variant="ghost" 
                                    onClick={generateMetaAnalysis}
                                    disabled={generatingMetaAnalysis}
                                >{generatingMetaAnalysis ? "Generating..." : "Generate Summary"}</Button>
                            </div>
                        }
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    </GameLayout>

  </div>
}
