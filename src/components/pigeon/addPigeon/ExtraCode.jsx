 {/* <div className="flex items-center justify-between my-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="race-results-switch"
                    checked={showPigeonResult}
                    onCheckedChange={setShowPigeonResult}
                  />
                  <Label htmlFor="race-results-switch">Race Results</Label>
                </div>
                {showPigeonResult && (
                  <Button
                    type="button"
                    onClick={addRaceResult}
                    className="flex items-center gap-2 px-3 py-1 text-white transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Result Race
                  </Button>
                )}
              </div>
            </div> */}

            {/* {showPigeonResult && (
              <div className="space-y-6">
                {raceResults.map((result, index) => (
                  <div
                    key={result.id}
                    className="border border-gray-200 rounded-lg p-4 relative"
                  >
                   
                    <button
                      type="button"
                      onClick={() => removeRaceResult(result.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <h4 className="text-md font-medium text-gray-800 mb-4">
                      Race Result #{index + 1}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-10">
                 
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Race Name
                        </label>
                        <input
                          type="text"
                          value={result.name}
                          onChange={(e) =>
                            updateRaceResult(result.id, "name", e.target.value)
                          }
                          placeholder="Enter race name"
                          className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                    
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date
                        </label>
                        <input
                          type="date"
                          value={result.date}
                          onChange={(e) =>
                            updateRaceResult(result.id, "date", e.target.value)
                          }
                          className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

              
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Distance
                        </label>
                        <input
                          type="text"
                          value={result.distance}
                          onChange={(e) =>
                            updateRaceResult(
                              result.id,
                              "distance",
                              e.target.value
                            )
                          }
                          placeholder="e.g., 500m, 600m"
                          className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                   
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total Birds
                        </label>
                        <input
                          type="number"
                          value={result.total}
                          onChange={(e) =>
                            updateRaceResult(result.id, "total", e.target.value)
                          }
                          placeholder="Total participating birds"
                          className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Place/Position
                        </label>
                        <input
                          type="text"
                          value={result.place}
                          onChange={(e) =>
                            updateRaceResult(result.id, "place", e.target.value)
                          }
                          placeholder="e.g., 1st, 2nd, Winner"
                          className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )} */}