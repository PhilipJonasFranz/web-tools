package utility

import (
	"fmt"
	"io/ioutil"
	"os"
	"time"
)

func SetupCacheCleanup() {
	fmt.Println("[WEB-TOOLS] Setting up cache worker.")

	/* Configure cache worker to run every minute */
	ticker := time.NewTicker(time.Minute)
	quit := make(chan struct{})

	go func() {
		for {
			select {
			case <-ticker.C:
				{
					deleted := 0
					items, _ := ioutil.ReadDir("cache")
					for _, item := range items {
						if !item.IsDir() {
							age := time.Since(item.ModTime())

							/* Delete files if they are older than 5 minutes */
							if age.Minutes() > 5 {
								os.Remove("cache/" + item.Name())
								deleted++
							}
						}
					}

					if deleted > 0 {
						fmt.Printf("[WEB-TOOLS] Cache worker deleted %d old file(s).\n", deleted)
					}
				}
			case <-quit:
				ticker.Stop()
				return
			}
		}
	}()
}
